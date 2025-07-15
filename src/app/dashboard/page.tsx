'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Signal,
  BookOpen,
  Diamond,
  MessageCircle,
  GraduationCap,
  UserCheck,
  BarChart2,
  School,
  LogOut,
  ChevronDown,
  Bell,
  Settings,
  UploadCloud
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single();
      if (error) {
        console.error(error);
      } else {
        setUsername(profile?.username || 'Trader');
        setAvatarUrl(profile?.avatar_url || '');
      }
    };
    getUserProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUploadAvatar = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error('Session error:', sessionError);
      return;
    }

    const userId = sessionData.session.user.id;
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    if (!urlData?.publicUrl) {
      console.error('URL error: Public URL not found');
      return;
    }

    const publicUrl = urlData.publicUrl;
    console.log('✅ Avatar Public URL:', publicUrl);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError.message);
      return;
    }

    setAvatarUrl(publicUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">KoffieForex Dashboard</h1>
        <div className="relative flex items-center gap-6">
          <Bell className="w-6 h-6 text-gray-500 cursor-pointer" />

          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img
              src={avatarUrl || '/default-avatar.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full border object-cover"
            />
            <span className="font-semibold text-sm">{username}</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-52 bg-white rounded shadow-md z-50 py-2">
              <label className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                <UploadCloud className="w-4 h-4" /> Upload Avatar
                <input type="file" onChange={handleUploadAvatar} className="hidden" />
              </label>
              <button onClick={() => router.push('/profile')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Profile
              </button>
              <button onClick={() => router.push('/settings')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
           <DashboardCard title="Signals" icon={<Signal className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/signals')} />
          <DashboardCard title="Premium" icon={<Diamond className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/premium')} />
          <DashboardCard title="My Broker" icon={<BarChart2 className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/broker')} />
          <DashboardCard title="Community Chat" icon={<MessageCircle className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/community')} />
          <DashboardCard title="My Profile" icon={<UserCheck className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/profile')} />
          <DashboardCard title="Mentorship" icon={<School className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/mentorship')} />
          <DashboardCard title="Education" icon={<BookOpen className="w-6 h-6 text-blue-600" />} onClick={() => router.push('/education')} />
        </motion.div>
      </main>
    </div>
  );
}

function DashboardCard({ title, icon, onClick }: any) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="p-6 rounded-xl bg-white shadow border cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
    </motion.div>
  );
}
