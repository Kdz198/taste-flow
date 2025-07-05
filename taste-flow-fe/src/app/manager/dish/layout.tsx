"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, DollarSign, Package, Star } from "lucide-react";
import React from "react";

interface ManagerDishLayoutProps {
  children: React.ReactNode;
}

const ManagerDishLayout = ({ children }: ManagerDishLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Dish Management</h1>
          <p className="text-gray-400 mt-1">Create and manage your delicious menu items</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-orange-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Dishes</CardTitle>
            <ChefHat className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white" id="dish-total-count">
              -
            </div>
            <p className="text-xs text-gray-400 mt-1">Menu items available</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-green-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Dishes</CardTitle>
            <Star className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400" id="dish-active-count">
              -
            </div>
            <p className="text-xs text-gray-400 mt-1">Available for order</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-red-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Inactive Dishes</CardTitle>
            <Package className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400" id="dish-inactive-count">
              -
            </div>
            <p className="text-xs text-gray-400 mt-1">Currently unavailable</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-blue-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Price</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400" id="dish-avg-price">
              -
            </div>
            <p className="text-xs text-gray-400 mt-1">Average dish price</p>
          </CardContent>
        </Card>
      </div>

      {children}
    </div>
  );
};

export default ManagerDishLayout;
