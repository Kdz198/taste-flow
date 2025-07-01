"use client";

import React from "react";

interface ManagerCategoryLayoutProps {
  children: React.ReactNode;
}

const ManagerCategoryLayout = ({ children }: ManagerCategoryLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Category Management</h1>
          <p className="text-gray-400 mt-1">Manage your food categories and organize your menu</p>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ManagerCategoryLayout;
