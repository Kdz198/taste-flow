import React from 'react'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Settings, Bell, Star, Award, ChefHat, Heart, Calendar } from 'lucide-react';
import Link from 'next/link';
export default function HeaderProfile() {
    return (
        <div className="bg-gradient-to-r from-[#2A2A2A] via-[#2A2A2A] to-[#1A1A1A] border-b border-[#3A3A3A]">
            <div className="px-8 py-8">
                {/* Navigation & Back Button */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-[#3A3A3A] border-[#4A4A4A] text-white hover:bg-[#4A4A4A] hover:text-white"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Home
                            </Button>
                        </Link>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-[#858787]">
                            <span>Home</span>
                            <span>/</span>
                            <span className="text-[#F26D16]">Profile</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-[#3A3A3A] text-[#858787] hover:bg-[#3A3A3A] hover:text-white"
                        >
                            <Bell size={16} className="mr-2" />
                            Notifications
                        </Button>
                        <Button
                            size="sm"
                            className="bg-[#F26D16] hover:bg-orange-600 text-white"
                        >
                            <Settings size={16} className="mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>

                {/* Profile Header Content */}
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left Side - Profile Info */}
                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-3 border-[#F26D16] bg-[#3A3A3A] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#2A2A2A]"></div>
                        </div>

                        {/* User Details */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                My <span className="text-[#F26D16]">Profile</span>
                            </h1>
                            <p className="text-[#858787] text-lg mb-3">
                                Manage your account settings and preferences
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                                    <span className="text-white text-sm font-medium">4.8</span>
                                    <span className="text-[#858787] text-sm">(124 reviews)</span>
                                </div>
                                <Badge className="bg-[#F26D16] hover:bg-[#F26D16] text-white">
                                    Gold Member
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Stats */}
                    <div className="flex-1 lg:ml-auto">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#F26D16]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Heart size={20} className="text-[#F26D16]" />
                                </div>
                                <div className="text-white font-bold text-xl">142</div>
                                <div className="text-[#858787] text-sm">Favorites</div>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#F26D16]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Star size={20} className="text-[#F26D16]" />
                                </div>
                                <div className="text-white font-bold text-xl">89</div>
                                <div className="text-[#858787] text-sm">Reviews</div>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#F26D16]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <ChefHat size={20} className="text-[#F26D16]" />
                                </div>
                                <div className="text-white font-bold text-xl">23</div>
                                <div className="text-[#858787] text-sm">Recipes</div>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#F26D16]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Calendar size={20} className="text-[#F26D16]" />
                                </div>
                                <div className="text-white font-bold text-xl">2+</div>
                                <div className="text-[#858787] text-sm">Years</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievement Banner */}
                <div className="mt-8 bg-gradient-to-r from-[#F26D16]/10 to-[#F26D16]/5 rounded-2xl p-4 border border-[#F26D16]/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#F26D16] rounded-full flex items-center justify-center">
                                <Award size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Welcome back, John!</h3>
                                <p className="text-[#858787] text-sm">You're just 2 orders away from reaching Platinum status</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-[#F26D16] text-[#F26D16] hover:bg-[#F26D16] hover:text-white"
                        >
                            View Progress
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
