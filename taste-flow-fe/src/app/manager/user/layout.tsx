"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCheck, Users, UserX } from "lucide-react";
import React from "react";

interface ManagerUserLayoutProps {
  children: React.ReactNode;
}

const ManagerUserLayout = ({ children }: ManagerUserLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">User Management</h1>
          <p className="text-gray-400 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white" id="user-total-count">
              -
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400" id="user-active-count">
              -
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Managers</CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400" id="user-managers-count">
              -
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Customers</CardTitle>
            <UserX className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400" id="user-customers-count">
              -
            </div>
          </CardContent>
        </Card>
      </div>

      {children}
    </div>
  );
};

export default ManagerUserLayout;
