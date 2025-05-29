import { Button } from "@/components/ui/button";
import { Plus, Minus, Heart, Star, Clock, Search, ShoppingCart, Grid3X3, List } from 'lucide-react';
import { categoryMock, dietaryOptionsMock, menuItemsMock, } from "../utils/mockApi";

export default function MenuBody() {
  const categories = categoryMock;
  const menuItems = menuItemsMock;
  const dietaryOptions = dietaryOptionsMock;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <div className="lg:w-1/4 space-y-6">
          {/* Search Filter */}
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#3A3A3A]">
            <h3 className="text-lg font-semibold mb-4">Search Menu</h3>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858787]" />
              <input
                type="text"
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#3A3A3A]">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-[#858787] hover:bg-[#3A3A3A] hover:text-white"
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#3A3A3A]">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-[#858787]">
                <span>$0</span>
                <span>$50</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                defaultValue="50"
                className="w-full h-2 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Dietary Options */}
          <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#3A3A3A]">
            <h3 className="text-lg font-semibold mb-4">Dietary Options</h3>
            <div className="space-y-3">
              {dietaryOptions.map((diet) => (
                <label key={diet} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#F26D16] bg-[#1A1A1A] border-[#3A3A3A] rounded focus:ring-[#F26D16]"
                  />
                  <span className="text-sm text-white">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-gradient-to-br from-[#F26D16]/10 to-[#F26D16]/5 rounded-2xl p-6 border border-[#F26D16]/20">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart size={20} className="text-[#F26D16]" />
              <h3 className="text-lg font-semibold">Your Order</h3>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#858787]">Items:</span>
                <span className="text-white">0</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-[#F26D16]">$0.00</span>
              </div>
            </div>
            <Button className="w-full bg-[#F26D16] hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">
              Checkout
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:w-3/4">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-[#858787]">
                Showing {menuItems.length} items
              </span>
              <select className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white text-sm focus:border-[#F26D16] focus:outline-none">
                <option>Sort by: Popular</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
                <option>Sort by: Rating</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg transition bg-[#F26D16] text-white">
                <Grid3X3 size={18} />
              </button>
              <button className="p-2 rounded-lg transition bg-[#2A2A2A] text-[#858787] hover:text-white">
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#2A2A2A] rounded-2xl overflow-hidden border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.isPopular && (
                      <span className="bg-[#F26D16] text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Popular
                      </span>
                    )}
                    {item.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        New
                      </span>
                    )}
                  </div>

                  {/* Heart */}
                  <Button className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 transition">
                    <Heart size={16} />
                  </Button>

                  {/* Price */}
                  <div className="absolute bottom-3 right-3 bg-black/70 rounded-full px-3 py-1">
                    <span className="text-[#F26D16] font-bold">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-gray-400 text-sm line-through ml-1">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[#858787] text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-[#858787]">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400" fill="currentColor" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{item.cookTime}</span>
                    </div>
                    <span>{item.calories} cal</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#3A3A3A] text-[#858787] text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button className="w-full bg-[#F26D16] hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}