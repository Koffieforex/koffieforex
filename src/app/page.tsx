'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSignup(e: any) {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) {
      setShowSignup(false);
      setShowLogin(true);
    } else {
      alert(error.message);
    }
  }

  async function handleLogin(e: any) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (!profile || !profile.username) {
        router.push('/verify-profile');
      } else {
        router.push('/dashboard');
      }
    } else {
      alert(error?.message);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-black">
      {/* ✅ BACKGROUND IMAGE with OPACITY LAYER */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg-portrait.jpg')" }}
        />
        <div className="absolute inset-0 bg-white opacity-90 backdrop-blur-[2px]" />
      </div>

      {/* ✅ MENU + LOGO */}
      <header className="relative z-20 flex justify-between items-center px-6 py-5 bg-white bg-opacity-60 backdrop-blur-md shadow-md">
        <h1 className="text-2xl font-extrabold text-blue-700">KoffieForex</h1>
        <nav className="flex gap-6 text-sm font-semibold items-center">
          <button className="hover:text-blue-600 flex items-center gap-1">🏠 Home</button>
          <button className="hover:text-blue-600 flex items-center gap-1">📶 Signals</button>
          <button className="hover:text-blue-600 flex items-center gap-1">📚 Courses</button>
          <button className="hover:text-blue-600 flex items-center gap-1">📊 Dashboard</button>
          <button className="hover:text-blue-600 flex items-center gap-1">💎 Premium</button>
        </nav>
      </header>

      {/* ✅ HERO SECTION */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-blue-600"
        >
          Trade Smart, Win Big with KoffieForex
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg text-black-700 max-w-2xl"
        >
          Ghana’s most trusted Forex learning platform. Learn, analyze, and earn with expert guidance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 flex gap-4"
        >
          <button
            onClick={() => setShowSignup(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition"
          >
            Login
          </button>
        </motion.div>
      </main>

      {/* ✅ LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 backdrop-blur p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Login</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded bg-white text-black" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded bg-white text-black" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Login
              </button>
            </form>
            <button onClick={() => setShowLogin(false)} className="mt-4 text-sm text-gray-600 text-center w-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ SIGNUP MODAL */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 backdrop-blur p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSignup}>
              <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded bg-white text-black" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded bg-white text-black" value={password} onChange={e => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 border rounded bg-white text-black" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Sign Up
              </button>
            </form>
            <button onClick={() => setShowSignup(false)} className="mt-4 text-sm text-gray-600 text-center w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
