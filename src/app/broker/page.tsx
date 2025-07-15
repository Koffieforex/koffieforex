// app/dashboard/mybroker/page.tsx
"use client";

import Link from "next/link";

export default function MyBrokerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 relative">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="absolute top-4 left-4 bg-blue-600 text-grey-900 px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        ← Back to Dashboard
      </Link>

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 mt-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Broker</h1>
        <div className="space-y-2">
          <p className="text-lg">
            Broker Name:{" "}
            <span className="font-semibold text-blue-600">Exness Limited</span>
          </p>
          <p className="text-lg">
            Broker Link:{" "}
            <Link
              href="Link will be provided soon"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              www.exness.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
