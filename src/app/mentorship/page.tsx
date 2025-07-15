"use client";

import { useSupabase } from "@/providers/SupabaseProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MentorshipAccess() {
  const { user } = useSupabase();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Set your universal password here
  const UNIVERSAL_PASSWORD = "Gabby501";

  const handleAccessChat = () => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    if (password !== UNIVERSAL_PASSWORD) {
      setError("Incorrect password");
      return;
    }

    // If everything checks out, go to chat
    router.push("/mentorship/chat");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Mentorship Program</h1>
        
        <div className="space-y-6">
          {/* Option 1: Contact Admin */}
          <Link
            href="https://t.me/Itz_Koffie"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-6 rounded-lg transition-colors text-center"
          >
            📞 Contact Admin
          </Link>

          {/* Option 2: Access Chat */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Mentorship Chat Access</h2>
            
            {user ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your User ID (auto-filled)
                  </label>
                  <input
                    type="text"
                    value={user.id}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the access password"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm mb-3">{error}</div>
                )}

                <button
                  onClick={handleAccessChat}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
                >
                  🔓 Unlock Chat Access
                </button>
              </>
            ) : (
              <div className="text-center py-4 text-gray-600">
                Please sign in to access the mentorship chat
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}