import { Button } from "@/components/ui/button";
import { Product } from "@/utils/type";
import { Crown, Star, Clock, TrendingUp } from 'lucide-react';


interface FeaturedMenuSectionProps {
  products: Product[];
}

export default function FeaturedMenuSection({ products }: FeaturedMenuSectionProps) {
  // Get top 3 most expensive products as featured items
  const featuredProducts = products
    .filter(p => p.status)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#F26D16]/10 border border-[#F26D16]/20 rounded-full px-4 py-2 mb-4">
          <Crown size={16} className="text-[#F26D16]" />
          <span className="text-[#F26D16] text-sm font-medium">Chef's Signature</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">
          Featured <span className="text-[#F26D16]">Specialties</span>
        </h2>
        <p className="text-[#858787] text-lg max-w-2xl mx-auto">
          Our most popular and highest-rated dishes, carefully crafted by our expert chefs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="aspect-[4/5] relative">
              <img
                src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-[#F26D16] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  #{index + 1} Popular
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold mb-2 leading-tight">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-white text-sm">4.8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-300" />
                    <span className="text-gray-300 text-sm">25-30 min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[#F26D16] text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-[#F26D16] hover:border-[#F26D16] rounded-full px-6 py-2 transition-all duration-300">
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12">
        <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105">
          View All Featured Items
        </Button>
      </div>
    </div>
  );
}