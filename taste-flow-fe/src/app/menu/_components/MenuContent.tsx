'use client';


import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, Heart, ShoppingCart, Utensils, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {  CategoryMenu, Product } from '@/utils/type';
import  { addItemLocal } from '@/store/slice/slice-cart';
import { queueAddItem } from '@/store/slice/slice-add-cart';
import { toast } from 'sonner';



interface MenuContentProps {
    products: Product[];
    categories: CategoryMenu[];
}

export default function MenuContent({ products, categories }: MenuContentProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [addedToCart, setAddedToCart] = useState<number | null>(null);
    const dispatch = useDispatch();
    const handleAddToCart = (product: Product) => {
        const productId = String(product.id); 
        const quantity = 1;
        dispatch(queueAddItem({ productId, quantity }));
        dispatch(addItemLocal({ productId, quantity }));
        toast.success(`${product.name} added to cart!`);
    };
    // // Filter products based on category, search, and price
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.categories.some(category => category.id === selectedCategory)
            );
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by price
        if (priceFilter !== 'all') {
            filtered = filtered.filter(product => {
                if (priceFilter === 'low') return product.price <= 50000;
                if (priceFilter === 'medium') return product.price > 50000 && product.price <= 150000;
                if (priceFilter === 'high') return product.price > 150000;
                return true;
            });
        }

        return filtered;
    }, [products, selectedCategory, searchQuery, priceFilter]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
    const handleAddToCartClick = (product: Product) => {
        handleAddToCart(product);


    }

    return (
        <div className="space-y-8">
            {/* Search & Filters */}
            <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A]">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858787]" size={20} />
                        <Input
                            placeholder="Search for dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-white rounded-xl focus:border-[#F26D16]"
                        />
                    </div>

                    {/* Price Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-[#858787]" />
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value as any)}
                            className="bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-xl px-4 py-2 focus:border-[#F26D16] outline-none"
                        >
                            <option value="all">All Prices</option>
                            <option value="low">Under 50K</option>
                            <option value="medium">50K - 150K</option>
                            <option value="high">Above 150K</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3">
                <Button
                    onClick={() => setSelectedCategory('all')}
                    className={`rounded-full px-6 py-2 transition-all duration-300 ${selectedCategory === 'all'
                        ? 'bg-[#F26D16] text-white hover:bg-orange-600'
                        : 'bg-[#2A2A2A] text-[#858787] border border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white'
                        }`}
                >
                    <Utensils size={16} className="mr-2" />
                    All Menu
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-full px-6 py-2 transition-all duration-300 ${selectedCategory === category.id
                            ? 'bg-[#F26D16] text-white hover:bg-orange-600'
                            : 'bg-[#2A2A2A] text-[#858787] border border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white'
                            }`}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-[#858787]">
                    Showing <span className="text-[#F26D16] font-semibold">{filteredProducts.length}</span> dishes
                </p>
                <div className="flex items-center gap-2">
                    <Eye size={16} className="text-[#858787]" />
                    <span className="text-sm text-[#858787]">Grid View</span>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl overflow-hidden border border-[#3A3A3A] hover:border-[#F26D16]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    >
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Status Badge */}
                            <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${product.status
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {product.status ? 'Available' : 'Unavailable'}
                            </div>

                            {/* Favorite Button */}
                            <Button className="absolute top-3 right-3 w-8 h-8 bg-black/30 hover:bg-red-500 text-white rounded-full p-1 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                <Heart size={14} />
                            </Button>

                            {/* Quick Actions */}
                            <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Button
                                    onClick={() => handleAddToCartClick(product)}
                                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300 ${addedToCart === product.id
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-[#F26D16] hover:bg-orange-600 text-white'
                                        }`}
                                >
                                    <ShoppingCart size={14} className="mr-1" />
                                    {addedToCart === product.id ? 'Added!' : 'Add to Cart'}
                                </Button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#F26D16] transition-colors duration-300">
                                {product.name}
                            </h3>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {product.categories.slice(0, 2).map((catId, index) => {
                                    const category = categories.find(cat => cat.id === catId.id);
                                    return category ? (
                                        <span
                                            key={index}
                                            className="text-xs bg-[#F26D16]/10 text-[#F26D16] px-2 py-1 rounded-full border border-[#F26D16]/20"
                                        >
                                            {category.name}
                                        </span>
                                    ) : null;
                                })}
                                {product.categories.length > 2 && (
                                    <span className="text-xs text-[#858787]">+{product.categories.length - 2}</span>
                                )}
                            </div>

                            {/* Recipe Info */}
                            <div className="flex items-center gap-4 mb-3 text-sm text-[#858787]">
                                <div className="flex items-center gap-1">
                                    <Utensils size={12} />
                                    <span>{product.ingredients.length} ingredients</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                                    <span>4.8</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-[#F26D16]">
                                    {formatPrice(product.price)}
                                </div>
                                <Button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-10 h-10 bg-[#F26D16] hover:bg-orange-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                                >
                                    <ShoppingCart size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No dishes found</h3>
                    <p className="text-[#858787] mb-6">Try adjusting your filters or search query</p>
                    <Button
                        onClick={() => {
                            setSelectedCategory('all');
                            setSearchQuery('');
                            setPriceFilter('all');
                        }}
                        className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-6 py-3"
                    >
                        Clear All Filters
                    </Button>
                </div>
            )}
        </div>
    );
}