import { Button } from "@/components/ui/button";
import { Camera, Save } from 'lucide-react';

export default function Rightside() {
  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-8 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-[#858787]">Update your personal details and preferences</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-3">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[#F26D16] rounded-full flex items-center justify-center">
            <Camera size={24} className="text-white" />
          </div>
          <div>
            <Button className="bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] rounded-lg mb-2">
              Choose Photo
            </Button>
            <p className="text-xs text-[#858787]">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">First Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Last Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
            placeholder="Doe"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Bio</label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      {/* Cooking Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Cooking Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'Vegetarian'].map((cuisine) => (
            <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#F26D16] bg-[#3A3A3A] border-[#4A4A4A] rounded focus:ring-[#F26D16]"
              />
              <span className="text-sm text-white">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1 bg-[#F26D16] hover:bg-orange-600 text-white rounded-lg font-medium">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
        <Button className="px-6 bg-transparent border border-[#4A4A4A] text-[#858787] hover:bg-[#3A3A3A] hover:text-white rounded-lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}