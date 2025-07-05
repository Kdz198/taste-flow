import { Button } from "@/components/ui/button";
import { MoveRight, Clock, Star, Award } from 'lucide-react';

export default function FeaturedRecipeHighlight() {
  return (
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
  );
}