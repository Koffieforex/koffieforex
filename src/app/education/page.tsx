
// app/education/page.tsx
'use client';

import Link from 'next/link';

const lessons = [
  { title: '📘 What is Forex?', href: '/education/lesson1' },
  { title: '📊 Support and Resistance', href: '/education/lesson2' },
  { title: '🕯️ Candlestick Confirmations', href: '/education/lesson3' },
  { title: '🕯️ Chart Patterns', href: '/education/lesson4' },
   { title: 'Market structure', href: '/education/lesson5' },
  { title: ' More and Detailed lessons will be in soon', href: '/education/lesson6' },
];

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🎓 Education Center</h1>
   <p>
    <a
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition ml-4"
        >
          ⬅ Back
        </a>
        </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson, index) => (
          <Link
            key={index}
            href={lesson.href}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:scale-[1.02] border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-blue-700">{lesson.title}</h2>
            <p className="text-gray-500 mt-2">Start this lesson now →</p>
          </Link>
        ))}
        </div>
      </div>
  );
}
