import { Star } from 'lucide-react';

export default function FanFavorites() {
  return (
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
  );
}