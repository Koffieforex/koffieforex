'use client';

import { useState } from 'react';
import { Bell, Mail, Lock, Globe, MoonStar, Palette, Save, Trash2, ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [themeColor, setThemeColor] = useState('blue');

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  // Custom Switch component
  const Switch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
    return (
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-medium text-gray-700">In-App Notifications</label>
                <p className="text-sm text-gray-500">Receive alerts within the platform</p>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onChange={setNotificationsEnabled} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block font-medium text-gray-700">Email Alerts</label>
                <p className="text-sm text-gray-500">Get important updates via email</p>
              </div>
              <Switch 
                checked={emailAlerts} 
                onChange={setEmailAlerts} 
              />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Mail className="h-4 w-4" />
              Change Email Address
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Lock className="h-4 w-4" />
              Change Password
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-medium text-gray-700">Dark Mode</label>
                <p className="text-sm text-gray-500">Switch between light and dark theme</p>
              </div>
              <Switch 
                checked={darkMode} 
                onChange={setDarkMode} 
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Theme Color</label>
              <div className="flex gap-2">
                {['blue', 'green', 'purple', 'red'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className={`h-8 w-8 rounded-full bg-${color}-500 ${themeColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    aria-label={`${color} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC (Universal Time)</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">London (GMT)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Language</label>
              <select
                defaultValue="english"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}