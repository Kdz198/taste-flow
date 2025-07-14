

import CartContent from "./_components/CartContent";

export default function CartPage() {
    return (
    
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Your <span className="text-[#F26D16]">Shopping Cart</span>
                    </h1>
                    <p className="text-[#858787] text-lg max-w-2xl mx-auto">
                        Review your selected items, choose what to order, and proceed to checkout.
                    </p>
                </div>
                
                <CartContent />
            </div>
      
    );
}