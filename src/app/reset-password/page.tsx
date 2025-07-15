"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmBack, setShowConfirmBack] = useState(false);

  const handleReset = async () => {
    setMessage("");
    if (!newPassword || !confirmPassword || !oldPassword) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    const email = session?.session?.user.email;

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });

    if (loginError) {
      setMessage("Old password is incorrect.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const handleBackClick = () => {
    setShowConfirmBack(true);
  };

  const confirmBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg-portrait.jpg')] bg-cover bg-center bg-fixed px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md text-gray-800"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">🔐 Reset Password</h2>
          <button
            onClick={handleBackClick}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>

        {showConfirmBack && (
          <div className="mt-6 p-4 border rounded-lg bg-white bg-opacity-95 shadow text-center">
            <p className="mb-4 text-sm text-gray-800">
              Are you sure you want to discard the password change?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmBack(false)}
                className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                No, Continue
              </button>
              <button
                onClick={confirmBack}
                className="px-4 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
              >
                Yes, Discard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
