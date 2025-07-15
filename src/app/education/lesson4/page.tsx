// app/education/lesson4/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const Lesson4 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">📘 Lesson 4: Chart Patterns</h1>

        <p className="text-gray-700 mb-4">
          Chart patterns are graphical representations of price movement that often repeat and form predictable outcomes. Recognizing these patterns helps traders anticipate market moves and plan entries or exits.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">📊 Most Common Chart Patterns</h2>

        <div className="my-6">
          <Image
            src="/images/double-top-bottom.png" // Replace with actual image in /public
            alt="Double Top and Bottom"
            width={800}
            height={400}
            className="rounded-lg shadow"
          />
          <p className="text-sm text-center text-gray-500 mt-2">Figure: Double Top & Bottom Patterns</p>
        </div>

        <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
          <li><strong>Double Top:</strong> A bearish reversal pattern that forms after an uptrend. Price tests a resistance level twice and fails to break it.</li>
          <li><strong>Double Bottom:</strong> A bullish reversal pattern formed after a downtrend. Price bounces off a support zone twice.</li>
          <li><strong>Head and Shoulders:</strong> Indicates a trend reversal. The pattern consists of three peaks: a higher peak (head) between two smaller peaks (shoulders).</li>
          <li><strong>Triangle Patterns:</strong> These include ascending, descending, and symmetrical triangles. They usually signal a continuation of the current trend.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">📌 How to Trade Chart Patterns</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Identify the pattern and draw it clearly</li>
          <li>Wait for a breakout confirmation</li>
          <li>Use volume as additional confirmation</li>
          <li>Place stop-loss below/above the pattern boundary</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">💡 Tips for Accuracy</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          <li>Use chart patterns on 1H and above for better reliability</li>
          <li>Combine with support/resistance and candlestick confirmations</li>
          <li>Fakeouts are common — always wait for candle close</li>
        </ul>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/education/lesson3" className="text-blue-600 hover:underline">← Previous Lesson</Link>
          <Link href="/education/lesson5">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
              Next Lesson →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lesson4;
