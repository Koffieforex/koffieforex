'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, ArrowLeft, Lock, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) console.error(error);
      else {
        setProfile(data);
        setUsername(data.username || '');
        setTelegram(data.telegram || '');
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({ username, telegram })
      .eq('id', profile.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Profile updated successfully!');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Account Profile</h1>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 md:p-8">
          {/* Avatar Section */}
          {profile?.avatar_url && (
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Profile Form */}
          {profile && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read-only Fields */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 text-gray-800">
                    {profile.full_name || 'Not provided'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 text-gray-800">
                    {profile.email || 'Not provided'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 text-gray-800">
                    {profile.phone || 'Not provided'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 text-gray-800">
                    {profile.country || 'Not provided'}
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Username *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter username"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Telegram Handle</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">@</span>
                    </div>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full pl-8 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href="/reset-password"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Reset Your Password
                  </Link>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}