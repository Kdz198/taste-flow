import { Button } from "@/components/ui/button";
import { MoveRight, MoveLeft, Clock, Star, Heart } from 'lucide-react';

export default function CraveWorthyDishes() {
  const dishes = [
    { title: "Easy Chicken Dinners", subtitle: "Deliciously Quick", time: "30 min", rating: "4.8" },
    { title: "Pasta Perfection", subtitle: "Comfort Food Classics", time: "25 min", rating: "4.9" },
    { title: "Healthy Bowl Recipes", subtitle: "Fresh & Nutritious", time: "20 min", rating: "4.7" }
  ];

  return (
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
        {dishes.map((item, index) => (
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
  );
}