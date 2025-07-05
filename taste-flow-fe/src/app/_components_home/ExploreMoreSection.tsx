import { Button } from "@/components/ui/button";
import { MoveRight, MoveLeft } from 'lucide-react';

export default function ExploreMoreSection() {
  const cuisines = [
    "Italian Classics",
    "Asian Fusion", 
    "Mexican Favorites",
    "Mediterranean"
  ];

  return (
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
        {cuisines.map((cuisine, index) => (
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
  );
}