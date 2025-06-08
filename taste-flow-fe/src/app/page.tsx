import { Button } from "@/components/ui/button";
import { MoveRight, MoveLeft, Clock, Star, Heart, Users, Flame, Award } from 'lucide-react';
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-white">
      {/* Hero Section */}
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
              <Link href="/manager">
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
            {[
              { icon: Users, label: "Active Cooks", value: "50K+" },
              { icon: Star, label: "Recipes", value: "2.5K+" },
              { icon: Heart, label: "Favorites", value: "100K+" },
              { icon: Award, label: "Reviews", value: "25K+" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300">
                <stat.icon size={24} className="text-[#F26D16] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[#858787] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div
          className="relative h-[500px] bg-center bg-cover rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundImage: "url('https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-lg px-8 md:px-12">
              <div className="inline-flex items-center gap-2 bg-[#F26D16] rounded-full px-4 py-2 mb-4">
                <Star size={14} className="text-white" fill="currentColor" />
                <span className="text-white text-sm font-medium">Chef's Special</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Mediterranean Seafood Paella
              </h2>
              <p className="text-gray-200 text-lg mb-6">
                A traditional Spanish dish bursting with saffron, fresh seafood, and aromatic herbs.
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-white">
                  <Clock size={16} />
                  <span className="text-sm">45 min</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Star size={16} fill="currentColor" className="text-yellow-400" />
                  <span className="text-sm">4.9 (2.3k reviews)</span>
                </div>
              </div>
              <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:scale-105">
                Get Recipe <MoveRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Crave-Worthy Dishes Section */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-bold leading-tight mb-4">
                Crave-Worthy Dishes <br />
                <span className="text-[#F26D16]">You'll Love</span>
              </h2>
              <p className="text-[#858787] text-lg">
                Discover crave-worthy dishes you'll love—easy to make, full of flavor, and always satisfying.
              </p>
            </div>
            <div className="lg:w-1/2 flex flex-col items-end gap-4">
              <div className="flex gap-3">
                <Button className="w-12 h-12 bg-[#2A2A2A] hover:bg-[#F26D16] text-white rounded-xl transition-all duration-300">
                  <MoveLeft size={20} />
                </Button>
                <Button className="w-12 h-12 bg-[#F26D16] hover:bg-orange-600 text-white rounded-xl transition-all duration-300">
                  <MoveRight size={20} />
                </Button>
              </div>
              <Button className="bg-transparent border border-[#F26D16] text-[#F26D16] hover:bg-[#F26D16] hover:text-white rounded-full px-6 py-2 transition-all duration-300">
                View All Categories
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Easy Chicken Dinners", subtitle: "Deliciously Quick", time: "30 min", rating: "4.8" },
              { title: "Pasta Perfection", subtitle: "Comfort Food Classics", time: "25 min", rating: "4.9" },
              { title: "Healthy Bowl Recipes", subtitle: "Fresh & Nutritious", time: "20 min", rating: "4.7" }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                <img
                  src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Heart Icon */}
                <Button className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-red-500 text-white rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Heart size={16} />
                </Button>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{item.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400" fill="currentColor" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <Button className="w-10 h-10 bg-[#F26D16] hover:bg-orange-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110">
                      <MoveRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore More Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">
              Explore <span className="text-[#F26D16]">More Flavors</span>
            </h2>
            <p className="text-[#858787] text-lg max-w-2xl mx-auto">
              Dive into our diverse collection of cuisines from around the world
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              "Italian Classics",
              "Asian Fusion",
              "Mexican Favorites",
              "Mediterranean"
            ].map((cuisine, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05]"
              >
                <img
                  src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                  alt={cuisine}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-center font-semibold">{cuisine}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <Button className="w-12 h-12 bg-[#2A2A2A] hover:bg-[#F26D16] text-white rounded-xl transition-all duration-300">
              <MoveLeft size={20} />
            </Button>
            <Button className="w-12 h-12 bg-[#F26D16] hover:bg-orange-600 text-white rounded-xl transition-all duration-300">
              <MoveRight size={20} />
            </Button>
          </div>
        </div>

        {/* Featured Recipe Highlight */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-[#3A3A3A]">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F26D16]/10 border border-[#F26D16]/20 rounded-full px-4 py-2 mb-6">
                  <Award size={16} className="text-[#F26D16]" />
                  <span className="text-[#F26D16] text-sm font-medium">Recipe of the Week</span>
                </div>
                <h2 className="text-4xl font-bold text-[#F26D16] mb-4">
                  Ultimate Creamy Mac and Cheese
                </h2>
                <p className="text-xl text-white mb-4 font-medium">
                  Cheesy, comforting, and satisfying—these recipes bring flavor to every bite.
                </p>
                <ul className="space-y-3 text-[#858787] mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#F26D16] rounded-full"></div>
                    Rich, gooey cheese in every bite
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#F26D16] rounded-full"></div>
                    Comfort food made effortlessly delicious
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#F26D16] rounded-full"></div>
                    Perfect for family or solo cravings
                  </li>
                </ul>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} />
                    <span className="text-sm">35 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Star size={16} fill="currentColor" className="text-yellow-400" />
                    <span className="text-sm">4.9 (1.2k reviews)</span>
                  </div>
                </div>
                <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105">
                  Get Recipe Now <MoveRight className="ml-2" size={16} />
                </Button>
              </div>
              <div className="relative">
                <img
                  src="https://th.bing.com/th/id/OIP.2EUlvJxLj0CvVQQZOq8wpQHaE7?rs=1&pid=ImgDetMain"
                  alt="Mac and Cheese"
                  className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#F26D16] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fan Favorites */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-[#F26D16]">Fan</span> Favorites
            </h2>
            <p className="text-[#858787] text-lg">
              The most loved recipes by our community
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05]"
              >
                <img
                  src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                  alt="Fan Favorite Dish"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-[#F26D16] text-white text-xs px-2 py-1 rounded-full font-bold">
                  #{index + 1}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-semibold text-center mb-1">Oven-Baked Ribs</h4>
                  <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="mb-20">
          <div
            className="relative h-[400px] bg-center bg-cover rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: "url('https://i.pinimg.com/originals/c8/ab/c8/c8abc8d040b09bf0ae0fb7bb3bd17672.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-2xl px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Dinner Favorites You'll <span className="text-[#F26D16]">Crave Again</span> and Again
                </h2>
                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                  Discover 88 delicious dinner recipes that are easy to make, full of flavor, and family-approved.
                  Start your culinary journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-[#F26D16] hover:bg-orange-600 text-white font-bold rounded-full px-8 py-3 transition-all duration-300 hover:scale-105">
                    View All Recipes <MoveRight className="ml-2" size={18} />
                  </Button>
                  <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-full px-8 py-3 transition-all duration-300">
                    Join Our Community
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}