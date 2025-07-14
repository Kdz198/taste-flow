'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EmptyStatesProps {
    type: 'loading' | 'no-items';
}

export default function EmptyStates({ type }: EmptyStatesProps) {
    if (type === 'loading') {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-[#858787]">Loading your order...</p>
            </div>
        );
    }

    if (type === 'no-items') {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-bold text-white mb-4">No items selected</h3>
                <p className="text-[#858787] mb-8 max-w-md mx-auto">
                    You haven't selected any items to order.
                    Please go back to your cart and select items to proceed.
                </p>
                <Link href="/cart">
                    <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105">
                        <ArrowLeft className="mr-2" size={18} />
                        Back to Cart
                    </Button>
                </Link>
            </div>
        );
    }

    return null;
}
