import CartContent from "./_components/OrderContent";



export default function CartPage() {
    return (
        <div className="text-white min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Your <span className="text-[#F26D16]">Order</span>
                    </h1>
                    <p className="text-[#858787] text-lg max-w-2xl mx-auto">
                        Review your order details below.
                    </p>
                </div>
                
                <CartContent />
            </div>
        </div>
    );
}
