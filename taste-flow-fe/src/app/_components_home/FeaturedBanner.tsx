import { Button } from "@/components/ui/button";
import { MoveRight, Clock, Star } from 'lucide-react';

export default function FeaturedBanner() {
  return (
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
  );
}