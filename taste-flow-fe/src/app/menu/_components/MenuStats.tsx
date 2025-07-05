import { FoodType } from '@/schemaValidations/product-schema';
import { Category } from '@/schemaValidations/category-schema';
import { DollarSign, Package, Tag, TrendingUp } from 'lucide-react';

interface MenuStatsProps {
  products: FoodType[];
  categories: Category[];
}

export default function MenuStats({ products, categories }: MenuStatsProps) {
  const availableProducts = products.filter(p => p.status);
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  const maxPrice = Math.max(...products.map(p => p.price));
  const minPrice = Math.min(...products.map(p => p.price));

  const stats = [
    {
      icon: Package,
      label: "Total Dishes",
      value: products.length.toString(),
      subtitle: `${availableProducts.length} available`,
      color: "text-blue-400"
    },
    {
      icon: Tag,
      label: "Categories",
      value: categories.length.toString(),
      subtitle: "Different cuisines",
      color: "text-green-400"
    },
    {
      icon: DollarSign,
      label: "Average Price",
      value: `$${avgPrice.toFixed(2)}`,
      subtitle: `$${minPrice} - $${maxPrice}`,
      color: "text-[#F26D16]"
    },
    {
      icon: TrendingUp,
      label: "Availability",
      value: `${Math.round((availableProducts.length / products.length) * 100)}%`,
      subtitle: "In stock now",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <IconComponent size={24} className={stat.color} />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[#858787] text-sm mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400">
                {stat.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
