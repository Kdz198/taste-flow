import { Button } from "@/components/ui/button";
import { MoveRight, Flame, Users, Star, Heart, Award } from 'lucide-react';
import Link from "next/link";

export default function HeroSection() {
  const stats = [
    { icon: Users, label: "Active Cooks", value: "50K+" },
    { icon: Star, label: "Recipes", value: "2.5K+" },
    { icon: Heart, label: "Favorites", value: "100K+" },
    { icon: Award, label: "Reviews", value: "25K+" }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F26D16]/10 border border-[#F26D16]/20 rounded-full px-4 py-2 mb-6">
            <Flame size={16} className="text-[#F26D16]" />
            <span className="text-[#F26D16] text-sm font-medium">Trending Now</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-[#F26D16]">88 All-Time </span>
            Best Dinner Recipes to{" "}
            <span className="text-[#F26D16] relative">
              Savor
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#F26D16] to-orange-600 rounded-full"></div>
            </span>
          </h1>
          <p className="text-[#858787] mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore all-time favorite recipes packed with flavor, perfect for family meals and special occasions.
            From quick weeknight dinners to impressive weekend feasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/manager/category">
              <Button className="bg-[#F26D16] hover:bg-orange-600 rounded-full px-8 py-3 text-white font-semibold transition-all duration-300 hover:scale-105">
                Explore All Recipes <MoveRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Button className="bg-transparent border border-[#F26D16] text-[#F26D16] hover:bg-[#F26D16] hover:text-white rounded-full px-8 py-3 font-semibold transition-all duration-300">
              Watch Cooking Videos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300">
              <stat.icon size={24} className="text-[#F26D16] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-[#858787] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}