"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabase } from "@/providers/SupabaseProvider";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import dayjs from "dayjs";

// Add typing indicator support (optional setup)
type Message = {
  id: string;
  user_id: string;
  text: string | null;
  image_url: string | null;
  created_at: string;
  updated_at?: string | null;
  profiles?: {
    username?: string;
  };
};

export default function CommunityChatPage() {
  const { user } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      setUsername(data?.username || null);
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    fetchMessages();

    const chatChannel = supabase
      .channel("realtime-chat")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        fetchMessages(); // Refresh full list on insert/update/delete
      })
      .subscribe();

    const typingChannel = supabase.channel("typing-channel").on(
      "broadcast",
      { event: "typing" },
      (payload) => {
        if (payload.payload.username !== username) {
          setIsTyping(payload.payload.username);
          setTimeout(() => setIsTyping(null), 3000);
        }
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [username]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*, profiles!fk_user_id(username)")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch messages error:", error);
    } else {
      setMessages(data);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!user) return;
    if (!newMessage && !imageUrl) return;

    if (editingId) {
      const { error } = await supabase
        .from("messages")
        .update({ text: newMessage })
        .eq("id", editingId);

      if (!error) {
        setEditingId(null);
        setNewMessage("");
        setImageUrl(null);
      }
      return;
    }

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      text: newMessage,
      image_url: imageUrl || null,
    });

    if (!error) {
      setNewMessage("");
      setImageUrl(null);
    } else {
      console.error("Message send error:", error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filePath = `chat/${uuidv4()}-${file.name}`;

    const { data, error } = await supabase.storage.from("chat").upload(filePath, file);

    if (error) {
      console.error("Upload failed:", error);
    } else {
      const { publicUrl } = supabase.storage.from("chat").getPublicUrl(filePath).data;
      setImageUrl(publicUrl);
    }

    setUploading(false);
  };

  const handleTyping = () => {
    if (!username) return;
    supabase.channel("typing-channel").send({
      type: "broadcast",
      event: "typing",
      payload: { username },
    });
  };

  const deleteMessage = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this message?");
    if (!confirm) return;

    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
  };

  const startEdit = (msg: Message) => {
    setNewMessage(msg.text || "");
    setEditingId(msg.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-700">💬 Koffie Community</h1>
        <p className="text-sm text-blue-700">
          Logged in as: <span className="font-semibold">{username || user?.email}</span>
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition ml-4"
        >
          ⬅ Back
        </a>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.user_id === user?.id;
          const isEdited = msg.updated_at && msg.updated_at !== msg.created_at;
          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative p-3 rounded-2xl max-w-xs md:max-w-md break-words shadow ${
                  isCurrentUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <div className="text-xs font-semibold mb-1">
                  {msg.profiles?.username || "Unknown"}
                </div>

                {msg.text && (
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.text}
                    {isEdited && <span className="text-[10px] italic ml-1 opacity-70">(edited)</span>}
                  </p>
                )}

                {msg.image_url && (
                  <div className="mt-2">
                    <Image
                      src={msg.image_url}
                      alt="uploaded"
                      width={300}
                      height={300}
                      className="rounded-lg border"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] mt-2 opacity-70">
                  <span>
                    {isCurrentUser && (
                      <>
                        <button onClick={() => startEdit(msg)} className="mr-2 hover:underline">
                          ✏ Edit
                        </button>
                        <button onClick={() => deleteMessage(msg.id)} className="hover:underline text-red-300">
                          🗑 Delete
                        </button>
                      </>
                    )}
                  </span>
                  <span>{dayjs(msg.created_at).format("hh:mm A")}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="text-sm text-gray-600 px-6 pb-1 italic">{isTyping} is typing...</div>
      )}

      {/* Input */}
      <footer className="bg-white shadow-inner p-4 flex gap-3 items-center sticky bottom-0 z-10">
        <input
          type="text"
          placeholder={editingId ? "Edit message..." : "Type a message..."}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
        />
        <label className="cursor-pointer">
          📎
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        <button
          onClick={sendMessage}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {editingId ? "Update" : "Send"}
        </button>
      </footer>
    </div>
  );
}
