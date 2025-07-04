import { Button } from "@/components/ui/button";
import { MoveRight } from 'lucide-react';

export default function CallToActionBanner() {
  return (
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
  );
}