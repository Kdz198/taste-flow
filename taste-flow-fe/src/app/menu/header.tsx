import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, ChefHat, Star, MapPin, Phone, Clock } from 'lucide-react';
import { categoryMock } from "../utils/mockApi";

export default function MenuHeader() {
  const categories = categoryMock

  return (
    <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] border-b border-[#3A3A3A]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          {/* Title & Description */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ChefHat size={24} className="text-[#F26D16]" />
              <span className="text-[#F26D16] text-sm font-medium uppercase tracking-wide">
                Restaurant Menu
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Our <span className="text-[#F26D16]">Delicious</span> Menu
            </h1>
            <p className="text-[#858787] text-lg max-w-2xl">
              Discover our carefully crafted dishes made with the finest ingredients. From appetizers to desserts, we have something for every taste.
            </p>
          </div>

          {/* Restaurant Info */}
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#3A3A3A] min-w-[300px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#F26D16] rounded-full flex items-center justify-center">
                <ChefHat size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Forkful Restaurant</h3>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="text-sm text-[#858787]">4.8 (2.3k reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[#858787]">
                <MapPin size={14} />
                <span>123 Food Street, City Center</span>
              </div>
              <div className="flex items-center gap-2 text-[#858787]">
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-[#858787]">
                <Clock size={14} />
                <span>Open: 10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav & Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                className="whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all bg-[#3A3A3A] text-[#858787] hover:bg-[#4A4A4A] hover:text-white"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Search & Cart */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858787]" />
              <input
                type="text"
                placeholder="Search menu..."
                className="w-64 pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
              />
            </div>
            <Button className="relative bg-[#F26D16] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105">
              <ShoppingCart size={18} className="mr-2" />
              Cart (0)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}