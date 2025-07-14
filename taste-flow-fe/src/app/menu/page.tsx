

import categoryRequest from "@/apiRequest/category";
import menuApiRequest from "@/apiRequest/menu";
import MenuContent from "./_components/MenuContent";



export default async function MenuPage() {
    const product = await menuApiRequest.getList();
    const categories = await categoryRequest.getCategoryList();


    return (
        <div className="text-white min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Our <span className="text-[#F26D16]">Menu</span>
                    </h1>
                    <p className="text-[#858787] text-lg max-w-2xl mx-auto">
                        Discover our delicious collection of recipes and dishes, carefully crafted for every taste
                    </p>
                </div>
                
                <MenuContent 
                    products={product.payload.data} 
                    categories={categories.payload.response.data}
                />
            </div>
        </div>
    );
}