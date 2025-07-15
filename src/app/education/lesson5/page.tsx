"use client";

import Image from "next/image";

export default function Lesson5() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">📊 Lesson 5: Market Structure</h1>

      <div className="space-y-6 max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl shadow-md">
        <p>
          Market structure is how price moves in trends. It reflects the behavior of institutional traders and smart money.
          Understanding market structure helps traders determine the direction of the trend and possible reversal points.
        </p>

        <h2 className="text-xl font-semibold text-blue-600">🧠 Key Concepts</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Higher Highs (HH):</strong> Price creates a new high that is higher than the previous high. Indicates an uptrend.</li>
          <li><strong>Higher Lows (HL):</strong> Price pulls back but stays above the previous low. Confirms the uptrend.</li>
          <li><strong>Lower Lows (LL):</strong> Price forms a new low below the previous low. Indicates a downtrend.</li>
          <li><strong>Lower Highs (LH):</strong> A lower peak after a downtrend pullback. Confirms the downtrend.</li>
          <li><strong>Break of Structure (BoS):</strong> When price breaks a previous high or low, potentially indicating a trend change.</li>
        </ul>

        <div>
          <h2 className="text-xl font-semibold text-blue-600 mt-6">📷 Chart Example</h2>
          <p className="mb-2">Below is a sample image showing a clear bullish and bearish market structure:</p>
          <Image
            src="/education/market-structure-example.png"
            alt="Market Structure Example"
            width={800}
            height={400}
            className="rounded-lg border"
          />
        </div>

        <h2 className="text-xl font-semibold text-blue-600">📌 Summary Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Follow HH and HL for uptrend entries.</li>
          <li>Watch for LL and LH for downtrend continuation.</li>
          <li>BoS often signals a change in market direction—trade carefully at those points.</li>
          <li>Use market structure to filter fake breakouts and low-probability setups.</li>
        </ul>

        <p className="mt-6 font-medium text-green-700">
          ✅ Understanding market structure is crucial before applying any strategy. It's the roadmap of price action.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition ml-4"
        >
          ⬅ Back
        </a>
      </div>
    </div>
  );
}
