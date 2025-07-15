"use client";

import Link from "next/link";
import Image from "next/image";

const Lesson3 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">📘 Lesson 3: Candlestick Confirmations</h1>

        <p className="text-gray-700 mb-4">
          Candlestick confirmations help traders validate whether price is likely to continue in the same direction or reverse. These confirmations can be used together with support and resistance for powerful entries.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">🔥 What Are Candlestick Confirmations?</h2>
        <p className="text-gray-700 mb-4">
          They are specific candle patterns that give you clues about price behavior. When these patterns form around key zones, they confirm strong trading opportunities.
        </p>

        <h2 className="text-lg font-semibold text-blue-600 mt-6 mb-2">✅ Examples of Confirmation Patterns</h2>

        <div className="my-6">
          <Image
            src="/images/engulfing-candle.png" // Replace with your actual image in /public
            alt="Bullish/Bearish Engulfing Candle"
            width={800}
            height={400}
            className="rounded-lg shadow"
          />
          <p className="text-sm text-center text-gray-500 mt-2">Figure: Bullish & Bearish Engulfing Patterns</p>
        </div>

        <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
          <li><strong>Engulfing Candle:</strong> A full-body candle that completely swallows the previous candle. Indicates strong reversal pressure.</li>
          <li><strong>Pin Bar:</strong> A long wick candle rejecting a key level. Shows rejection and potential reversal.</li>
          <li><strong>Inside Bar:</strong> A small candle within the range of the previous one. Often signals a breakout is coming.</li>
          <li><strong>Doji:</strong> Shows indecision. Stronger when formed at support/resistance zones.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">📌 How to Use Them</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Use on higher timeframes like 1H, 4H, Daily</li>
          <li>Combine with support/resistance zones</li>
          <li>Wait for a close above/below the confirmation candle</li>
          <li>Always apply proper risk management</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">💡 Hidden Tips</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          <li>Always wait for the candle to fully close before taking action</li>
          <li>Volume can help confirm the strength of the candle</li>
          <li>Use confirmations only at key levels, not randomly</li>
        </ul>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/education/lesson2" className="text-blue-600 hover:underline">← Previous Lesson</Link>
          <Link href="/education/lesson4">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
              Next Lesson →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lesson3;
