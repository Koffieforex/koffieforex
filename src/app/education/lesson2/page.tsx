// app/education/lesson2/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const Lesson2 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">📘 Lesson 2: Support and Resistance</h1>

        <p className="text-gray-700 mb-4">
          Support and resistance are key concepts in technical analysis used to identify price levels where an asset tends to stop and reverse.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">📉 What is Support?</h2>
        <p className="text-gray-700 mb-4">
          Support is a price level where a downtrend can be expected to pause due to a concentration of buying interest.
          Traders often buy at support in hopes the price will bounce upward.
        </p>

        <div className="my-4">
          <Image
            src="/images/support-example.png" // <-- Replace this with your actual file name
            alt="Support Zone Example"
            width={800}
            height={400}
            className="rounded-lg shadow"
          />
          <p className="text-sm text-center text-gray-500 mt-2">Figure: Example of a support zone</p>
        </div>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">📈 What is Resistance?</h2>
        <p className="text-gray-700 mb-4">
          Resistance is a price level where an uptrend tends to pause or reverse due to selling pressure. Traders often sell at resistance in anticipation of a price drop.
        </p>

        <div className="my-4">
          <Image
            src="/images/resistance-example.png" // <-- Replace this with your actual file name
            alt="Resistance Zone Example"
            width={800}
            height={400}
            className="rounded-lg shadow"
          />
          <p className="text-sm text-center text-gray-500 mt-2">Figure: Example of a resistance zone</p>
        </div>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">💡 Hidden Tips</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Support can become resistance (and vice versa) after a breakout</li>
          <li>Look for multiple touches to confirm strong zones</li>
          <li>Combine with candlestick confirmations for better accuracy</li>
        </ul>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/education/lesson1" className="text-blue-600 hover:underline">← Previous Lesson</Link>
          <Link href="/education/lesson3">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
              Next Lesson →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lesson2;
