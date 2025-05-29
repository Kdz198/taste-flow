

import HeaderProfile from './headerprofile';
import Leftside from './Leftside';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1B1B1B]">
      {/* Enhanced Header Section */}
      {/* <HeaderProfile /> */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          My <span className="text-[#F26D16]">Profile</span>
        </h1>
        <p className="text-[#858787] text-lg">
          Manage your account settings and preferences
        </p>
      </div>
      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="flex flex-row gap-8">
          <div className="flex-[0.3]">
            <Leftside />
          </div>
          <div className="flex-[0.7] bg-[#2A2A2A] rounded-2xl p-6 shadow-lg border border-[#3A3A3A]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}