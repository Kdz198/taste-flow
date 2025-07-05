import { Button } from "@/components/ui/button";
import { Search, Filter, ChefHat, Clock, Star } from 'lucide-react';

export default function MenuHeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F26D16]/10 border border-[#F26D16]/20 rounded-full px-4 py-2 mb-6">
            <ChefHat size={16} className="text-[#F26D16]" />
            <span className="text-[#F26D16] text-sm font-medium">Our Menu</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Discover Our{" "}
            <span className="text-[#F26D16] relative">
              Delicious
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#F26D16] to-orange-600 rounded-full"></div>
            </span>{" "}
            Menu
          </h1>
          <p className="text-[#858787] mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our carefully crafted dishes made with the finest ingredients. 
            From appetizers to desserts, find your perfect meal.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#858787]" size={20} />
              <input
                type="text"
                placeholder="Search for dishes..."
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-full py-4 pl-12 pr-16 text-white placeholder-[#858787] focus:outline-none focus:border-[#F26D16] transition-all duration-300"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#F26D16] hover:bg-orange-600 text-white rounded-full p-2 h-8 w-8">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300">
            <ChefHat size={24} className="text-[#F26D16] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-[#858787] text-sm">Signature Dishes</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300">
            <Clock size={24} className="text-[#F26D16] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">15-30</div>
            <div className="text-[#858787] text-sm">Minutes Prep Time</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300">
            <Star size={24} className="text-[#F26D16] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">4.8+</div>
            <div className="text-[#858787] text-sm">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
