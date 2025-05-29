"use client";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Star, MoreVertical, MoveRight, Search, Filter, Grid3X3, List, Share2, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function RightSide() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent');

  const favoriteRecipes = [
    {
      id: 1,
      title: "Creamy Garlic Parmesan Pasta",
      image: "https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg",
      cookTime: "25 min",
      rating: 4.8,
      difficulty: "Easy",
      category: "Quick Dinners",
      addedDate: "2 days ago",
      description: "Rich and creamy pasta with roasted garlic and fresh parmesan cheese",
      chef: "Chef Maria",
      saves: 342
    },
    {
      id: 2,
      title: "Honey Glazed Salmon with Vegetables",
      image: "https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg",
      cookTime: "30 min",
      rating: 4.9,
      difficulty: "Medium",
      category: "Healthy Meals",
      addedDate: "1 week ago",
      description: "Perfectly glazed salmon with seasonal roasted vegetables",
      chef: "Chef David",
      saves: 528
    },
    {
      id: 3,
      title: "Classic Chocolate Chip Cookies",
      image: "https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg",
      cookTime: "45 min",
      rating: 4.7,
      difficulty: "Easy",
      category: "Desserts",
      addedDate: "3 days ago",
      description: "Soft and chewy cookies with premium chocolate chips",
      chef: "Chef Sarah",
      saves: 891
    },
    {
      id: 4,
      title: "Spicy Thai Chicken Curry",
      image: "https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg",
      cookTime: "40 min",
      rating: 4.6,
      difficulty: "Hard",
      category: "International",
      addedDate: "5 days ago",
      description: "Authentic Thai curry with coconut milk and fresh herbs",
      chef: "Chef Tom",
      saves: 756
    },
    {
      id: 5,
      title: "Mediterranean Quinoa Bowl",
      image: "https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg",
      cookTime: "20 min",
      rating: 4.8,
      difficulty: "Easy",
      category: "Healthy Meals",
      addedDate: "1 week ago",
      description: "Fresh and nutritious bowl with quinoa, vegetables, and feta cheese",
      chef: "Chef Anna",
      saves: 445
    },
    {
      id: 6,
      title: "BBQ Pulled Pork Sandwich",
      image: "https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg",
      cookTime: "4 hours",
      rating: 4.9,
      difficulty: "Medium",
      category: "BBQ & Grilling",
      addedDate: "2 weeks ago",
      description: "Slow-cooked pulled pork with homemade BBQ sauce",
      chef: "Chef Mike",
      saves: 623
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858787]" />
          <input
            type="text"
            placeholder="Search your favorite recipes..."
            className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none transition"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">My Favorite Recipes</h3>
              <p className="text-[#858787] text-sm">{favoriteRecipes.length} saved recipes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white text-sm focus:border-[#F26D16] focus:outline-none"
            >
              <option value="recent">Recently Added</option>
              <option value="rating">Highest Rated</option>
              <option value="cookTime">Cook Time</option>
              <option value="alphabetical">A-Z</option>
            </select>

            {/* Filter Button */}
            <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white p-2 rounded-lg">
              <Filter size={18} />
            </Button>

            {/* View Mode Toggle */}
            <div className="flex bg-[#2A2A2A] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition ${
                  viewMode === 'grid' ? 'bg-[#F26D16] text-white' : 'text-[#858787] hover:text-white'
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition ${
                  viewMode === 'list' ? 'bg-[#F26D16] text-white' : 'text-[#858787] hover:text-white'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] group"
            >
              {/* Recipe Image */}
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button className="w-10 h-10 bg-white/90 hover:bg-white text-black rounded-full">
                      <BookOpen size={18} />
                    </Button>
                    <Button className="w-10 h-10 bg-white/90 hover:bg-white text-black rounded-full">
                      <Share2 size={18} />
                    </Button>
                  </div>
                </div>

                {/* Favorite Heart */}
                <Button className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 p-1 rounded-full">
                  <Heart size={16} fill="currentColor" />
                </Button>

                {/* Quick Actions Menu */}
                <Button className="absolute top-3 left-3 w-8 h-8 bg-black/50 hover:bg-black/70 p-1 rounded-full">
                  <MoreVertical size={16} className="text-white" />
                </Button>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#F26D16] text-white text-xs px-2 py-1 rounded-full">
                    {recipe.category}
                  </span>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute bottom-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full bg-black/50 ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-4">
                <h4 className="text-white font-semibold mb-2 line-clamp-2 text-lg">
                  {recipe.title}
                </h4>
                
                <p className="text-[#858787] text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-sm text-[#858787] mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>
                  <span className="text-xs">{recipe.saves} saves</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#858787]">by {recipe.chef}</p>
                    <p className="text-xs text-[#858787]">Added {recipe.addedDate}</p>
                  </div>
                  <Button className="w-8 h-8 bg-orange-500 hover:bg-orange-600 p-1 rounded-full">
                    <MoveRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex gap-4 p-6 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-lg hover:shadow-xl transition-all group"
            >
              {/* Recipe Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <Button className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 p-1 rounded-full">
                  <Heart size={12} fill="currentColor" />
                </Button>
              </div>

              {/* Recipe Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold text-xl truncate pr-4">
                    {recipe.title}
                  </h4>
                  <Button className="w-8 h-8 bg-black/50 hover:bg-black/70 p-1 rounded-full flex-shrink-0">
                    <MoreVertical size={16} className="text-white" />
                  </Button>
                </div>

                <p className="text-[#858787] text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-[#858787] mb-3">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span>{recipe.rating}</span>
                  </div>
                  <span className={`${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                  <span className="bg-[#F26D16] text-white text-xs px-2 py-1 rounded-full">
                    {recipe.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#858787]">
                    <p>by {recipe.chef} • {recipe.saves} saves</p>
                    <p>Added {recipe.addedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white px-4 py-2 rounded-lg text-sm">
                      <Share2 size={14} className="mr-1" />
                      Share
                    </Button>
                    <Button className="bg-[#F26D16] hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
                      <BookOpen size={14} className="mr-1" />
                      View Recipe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Section */}
      <div className="text-center pt-8">
        <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white rounded-xl px-8 py-3 border border-[#3A3A3A]">
          Load More Favorites
        </Button>
        <p className="text-[#858787] text-sm mt-2">
          Showing {favoriteRecipes.length} of 42 recipes
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        {[
          { label: 'Total Favorites', value: '42', color: 'text-[#F26D16]' },
          { label: 'This Month', value: '8', color: 'text-green-500' },
          { label: 'Most Liked', value: '5★', color: 'text-yellow-500' },
          { label: 'Collections', value: '4', color: 'text-blue-500' }
        ].map((stat, index) => (
          <div key={index} className="text-center p-4 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[#858787] text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}