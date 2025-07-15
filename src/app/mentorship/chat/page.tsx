// app/mentorship/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabase } from "@/providers/SupabaseProvider";
import dayjs from "dayjs";
import Link from "next/link";

type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
};

type Message = {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  profile?: Profile;
};

export default function MentorshipChat() {
  const { user } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const TELEGRAM_LINK = "https://t.me/Itz_Koffie";

  useEffect(() => {
    fetchMessages();
    const channel = setupRealtimeUpdates();
    
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user]);

  const setupRealtimeUpdates = () => {
    return supabase
      .channel("mentorship-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mentorship_messages",
          filter: user?.id ? `user_id=neq.${user.id}` : undefined // Don't show our own inserts (handled optimistically)
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .eq("id", newMessage.user_id)
            .single();

          setMessages((prev) => [...prev, { ...newMessage, profile }]);
          scrollToBottom();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "mentorship_messages",
        },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .subscribe();
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: messages, error: messagesError } = await supabase
        .from("mentorship_messages")
        .select("id, text, created_at, user_id")
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      const userIds = Array.from(new Set(messages.map((msg) => msg.user_id)));
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const combined = messages.map((msg) => ({
        ...msg,
        profile: profiles.find((p) => p.id === msg.user_id),
      }));

      setMessages(combined);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.id) return;

    try {
      // Create optimistic message
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticMessage = {
        id: optimisticId,
        text: newMessage,
        created_at: new Date().toISOString(),
        user_id: user.id,
        profile: {
          id: user.id,
          username: user.email?.split("@")[0] || "User",
          avatar_url: null,
        },
      };

      // Add to UI immediately
      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");
      scrollToBottom();

      // Send to server
      const { error } = await supabase
        .from("mentorship_messages")
        .insert({
          text: newMessage,
          user_id: user.id,
        });

      if (error) throw error;

      // Remove the optimistic message (real one will come via subscription)
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId));

    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
      // Rollback optimistic update
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("optimistic-")));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    try {
      const { error } = await supabase
        .from("mentorship_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to delete message:", err);
      setError("Failed to delete message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <p className="font-medium">Error loading chat:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchMessages}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
          <Link href="/dashboard" className="block mt-2 text-center text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">💬 Mentorship Chat</h1>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {messages.length} messages
          </span>
        </div>
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <span>📞 Contact Admin</span>
        </a>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.user_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg break-words px-4 py-3 rounded-lg shadow relative ${
                    isOwn
                      ? "bg-blue-100 rounded-tr-none"
                      : "bg-white rounded-tl-none"
                  }`}
                >
                  {!isOwn && msg.profile && (
                    <div className="flex items-center mb-1">
                      {msg.profile.avatar_url ? (
                        <img
                          src={msg.profile.avatar_url}
                          alt={msg.profile.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center text-xs">
                          {msg.profile.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-sm text-gray-700">
                        {msg.profile.username}
                      </span>
                    </div>
                  )}
                  <div className="text-gray-800">{msg.text}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {dayjs(msg.created_at).format("h:mm A")}
                    </span>
                    {isOwn && (
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="text-xs text-red-500 hover:text-red-700 ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t sticky bottom-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            disabled={!user}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || !user}
            className={`bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center ${
              (!newMessage.trim() || !user)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {!user && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Please sign in to send messages
          </p>
        )}
      </div>
    </div>
  );
}