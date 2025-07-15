
import menuApiRequest from "@/apiRequest/menu";
import orderApiRequest from "@/apiRequest/order";
import { OrderContent } from "./_components";



export default async function OrderPage() {
    const menuList = await menuApiRequest.getList();
    const discountCodeList = await orderApiRequest.getDiscount();
    return (
        <div className="">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Your <span className="text-[#F26D16]">Order</span>
                    </h1>
                    <p className="text-[#858787] text-lg max-w-2xl mx-auto">
                        Review your order details below.
                    </p>
                </div>

                <OrderContent menuList={menuList.payload.data} discountCodeList={discountCodeList.payload} />
            </div>
        </div>
    );
}
