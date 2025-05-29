"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, Shield, Bell, Globe, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

export default function RightSide() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">General Settings</h3>
          <p className="text-[#858787]">Manage your basic account preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
              defaultValue="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
              defaultValue="johndoe_chef"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
              defaultValue="john.doe@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Language</label>
            <select className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white focus:border-[#F26D16] focus:outline-none transition">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Timezone</label>
            <select className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white focus:border-[#F26D16] focus:outline-none transition">
              <option value="utc">UTC</option>
              <option value="est">Eastern Time</option>
              <option value="pst">Pacific Time</option>
              <option value="gmt">GMT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Security & Privacy</h3>
          <p className="text-[#858787]">Protect your account with advanced security features</p>
        </div>

        {/* Password Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 pr-12 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#858787] hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button className="mt-3 bg-[#F26D16] hover:bg-orange-600 text-white rounded-xl px-4 py-2">
            Change Password
          </Button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="mb-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#F26D16]" />
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-[#858787] text-sm">Add an extra layer of security</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                twoFactorEnabled ? 'bg-[#F26D16]' : 'bg-[#3A3A3A]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="flex gap-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1 text-sm">
                Configured
              </Button>
              <Button className="bg-transparent border border-[#3A3A3A] text-[#858787] hover:bg-[#3A3A3A] hover:text-white rounded-lg px-3 py-1 text-sm">
                Manage
              </Button>
            </div>
          )}
        </div>

        {/* Login Sessions */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3">Active Sessions</h4>
          <div className="space-y-3">
            {[
              { device: "Chrome on Windows", location: "New York, US", current: true },
              { device: "Safari on iPhone", location: "New York, US", current: false },
              { device: "Firefox on MacOS", location: "San Francisco, US", current: false }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
                <div>
                  <p className="text-white text-sm font-medium">{session.device}</p>
                  <p className="text-[#858787] text-xs">{session.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  {session.current && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Current</span>
                  )}
                  {!session.current && (
                    <Button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg">
                      End Session
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Notification Preferences</h3>
          <p className="text-[#858787]">Choose how you want to be notified</p>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[#F26D16]" />
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-[#858787] text-sm">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                emailNotifications ? 'bg-[#F26D16]' : 'bg-[#3A3A3A]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-[#F26D16]" />
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-[#858787] text-sm">Browser and mobile alerts</p>
              </div>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                pushNotifications ? 'bg-[#F26D16]' : 'bg-[#3A3A3A]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notification Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              "New recipe recommendations",
              "Recipe comments and likes",
              "Follower activity",
              "Weekly cooking tips",
              "System updates",
              "Security alerts"
            ].map((type, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={index < 4}
                  className="w-4 h-4 text-[#F26D16] bg-[#1A1A1A] border-[#3A3A3A] rounded focus:ring-[#F26D16] focus:ring-2"
                />
                <span className="text-sm text-white">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Data & Privacy</h3>
          <p className="text-[#858787]">Manage your data and privacy settings</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
            <div>
              <h4 className="text-white font-medium">Download My Data</h4>
              <p className="text-[#858787] text-sm">Export all your account data</p>
            </div>
            <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-lg px-4 py-2">
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
            <div>
              <h4 className="text-white font-medium">Profile Visibility</h4>
              <p className="text-[#858787] text-sm">Control who can see your profile</p>
            </div>
            <select className="px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white text-sm focus:border-[#F26D16] focus:outline-none">
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-xl border border-red-600/30">
            <div>
              <h4 className="text-red-400 font-medium">Delete Account</h4>
              <p className="text-red-300 text-sm">Permanently delete your account and all data</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2">
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1 bg-[#F26D16] hover:bg-orange-600 text-white rounded-xl font-medium py-3">
          <Save size={16} className="mr-2" />
          Save All Changes
        </Button>
        <Button className="px-8 bg-transparent border border-[#3A3A3A] text-[#858787] hover:bg-[#3A3A3A] hover:text-white rounded-xl">
          Reset
        </Button>
      </div>
    </div>
  );
}