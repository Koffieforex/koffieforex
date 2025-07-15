'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useSupabase } from '@/providers/SupabaseProvider';

export default function VerifyProfilePage() {
  const router = useRouter();
  const { user } = useSupabase();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You are not logged in.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email: user.email,
        ...formData,
      },
    ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      alert('Profile completed!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ✅ BACKGROUND IMAGE + blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/bg-verify.jpg" // Make sure this image exists in /public/images/
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
      </div>

      {/* ✅ FORM PANEL */}
      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black bg-white"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black bg-white"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black bg-white"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black bg-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
