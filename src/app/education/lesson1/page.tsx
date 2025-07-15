// app/education/lesson1/page.tsx
"use client";

import Link from "next/link";

const Lesson1 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">📘 Lesson 1: What is Forex?</h1>

        <p className="text-gray-700 mb-4">
          Forex, short for <strong>foreign exchange</strong>, refers to the global marketplace where currencies are
          traded. It's the largest and most liquid financial market in the world, with over <strong>$7 trillion</strong> in daily volume.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">🌍 Why Forex Exists</h2>
        <p className="text-gray-700 mb-4">
          Forex exists because people, companies, and governments need to exchange one currency for another.
          Whether it's for travel, international business, or investing, currency exchange is essential.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">📈 Who Trades Forex?</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Banks and central banks</li>
          <li>Corporations</li>
          <li>Hedge funds</li>
          <li>Retail traders (like you!)</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">🕒 When Does Forex Trade?</h2>
        <p className="text-gray-700 mb-4">
          The Forex market is open <strong>24 hours a day, 5 days a week</strong>. It follows global financial centers like:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Sydney</li>
          <li>Tokyo</li>
          <li>London</li>
          <li>New York</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">💡 Hidden Tips</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Most volatile time is during the London-New York overlap</li>
          <li>Start by focusing on one major pair like EUR/USD</li>
          <li>Always use a demo account before trading real money</li>
        </ul>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/education" className="text-blue-600 hover:underline">← Back to Education</Link>
          <Link href="/education/lesson2">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
              Next Lesson →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lesson1;
