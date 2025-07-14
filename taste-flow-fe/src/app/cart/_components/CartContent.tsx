'use client'

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMenuList } from "@/hook/useMenu";
import { RootState } from "@/store";
import { Product } from "@/utils/type";
import {
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemLocal,
  removeItemLocal,
  clearCart
} from "@/store/slice/slice-cart";
import {
  queueAddItem,
  clearAddQueue
} from "@/store/slice/slice-add-cart";
import {
  queueRemoveItem,
  clearRemoveQueue
} from "@/store/slice/slice-remove-cart";
import { useAuth } from "@/lib/auth-context";
import { useAddToCart, useRemoveFromCart } from "@/hook/useCart";
import { useRouter } from "next/navigation";
import {
  setOrderInfo,
  setOrderItems,
  clearOrder,
} from "@/store/slice/slice-order";
type CartItems = Product & { quantity: number };

export default function CartContent() {
  const dispatch = useDispatch();
  const { data: menuList, isLoading } = useMenuList();
  const { items } = useSelector((state: RootState) => state.cart);
  const addCart = useSelector((state: RootState) => state.cartAdd);
  const removeCart = useSelector((state: RootState) => state.cartRemove);
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  const { mutateAsync: mutateAdd } = useAddToCart();
  const { mutateAsync: mutateRemove } = useRemoveFromCart();
  const router = useRouter();
  useEffect(() => {
    if (!menuList || !items) return;
    const cartData: CartItems[] = menuList
      .filter(product => items[product.id.toString()] !== undefined)
      .map(product => ({
        ...product,
        quantity: items[product.id.toString()],
      }));

    setCartItems(cartData);
  }, [menuList, items]);

  const handleItemSelect = (itemId: number, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) newSelectedItems.add(itemId);
    else newSelectedItems.delete(itemId);

    setSelectedItems(newSelectedItems);
    setIsSelectAll(newSelectedItems.size === cartItems.length);

    const selectedCartItems = cartItems.filter(item => newSelectedItems.has(item.id));
    dispatch(setOrderItems(selectedCartItems.map(item => ({
      dishId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
    }))));
  };

  const handleSelectAll = (checked: boolean) => {
    let newSelectedItems: Set<number>;
    if (checked) {
      newSelectedItems = new Set(cartItems.map(item => item.id));
    } else {
      newSelectedItems = new Set();
    }

    setSelectedItems(newSelectedItems);
    setIsSelectAll(checked);

    // 👇 Update Redux order items
    const selectedCartItems = cartItems.filter(item => newSelectedItems.has(item.id));
    dispatch(setOrderItems(selectedCartItems.map(item => ({
      dishId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
    }))));
  };


  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const updateQuantity = (productId: number, newQuantity: number) => {
    const currentQuantity = items[productId.toString()] || 0;
    if (newQuantity <= 0) {
      dispatch(removeItemLocal({ productId: productId.toString(), quantity: currentQuantity }));
      dispatch(queueRemoveItem({ productId: productId.toString(), quantity: currentQuantity }));
    } else {
      if (newQuantity > currentQuantity) {
        const diff = newQuantity - currentQuantity;
        dispatch(addItemLocal({ productId: productId.toString(), quantity: diff }));
        dispatch(queueAddItem({ productId: productId.toString(), quantity: diff }));
      } else {
        const diff = currentQuantity - newQuantity;
        dispatch(removeItemLocal({ productId: productId.toString(), quantity: diff }));
        dispatch(queueRemoveItem({ productId: productId.toString(), quantity: diff }));
      }
    }
  };

  const removeItem = (productId: number) => {
    const quantity = items[productId.toString()] || 0;
    if (quantity > 0) {
      dispatch(removeItemLocal({ productId: productId.toString(), quantity }));
      dispatch(queueRemoveItem({ productId: productId.toString(), quantity }));
    }
    const newSelectedItems = new Set(selectedItems);
    newSelectedItems.delete(productId);
    setSelectedItems(newSelectedItems);
    setIsSelectAll(newSelectedItems.size === cartItems.length - 1);
  };

  const clearAllItems = () => {
    dispatch(clearCart());
    dispatch(clearAddQueue());
    dispatch(clearRemoveQueue());
    setSelectedItems(new Set());
    setIsSelectAll(false);
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = selectedItems.size > 0 ? 15000 : 0;
  const total = subtotal + deliveryFee;

  const handleProceedToPayment = async () => {
    try {
      const addItems = addCart.itemsToAdd;
      const removeItems = removeCart.itemsToRemove;

      // 🛒 Thêm sản phẩm vào cart
      if (Object.keys(addItems).length > 0) {
        await mutateAdd({
          userId: user?.id || 0,
          itemsToAdd: addItems,
        });
      }


      if (Object.keys(removeItems).length > 0) {
        await mutateRemove({
          userId: user?.id || 0,
          itemsToRemove: removeItems,
        });

        Object.entries(removeItems).forEach(([productId, quantity]) => {
          dispatch(removeItemLocal({ productId, quantity }));
        });
      }


      dispatch(clearAddQueue());
      dispatch(clearRemoveQueue());
      dispatch(setOrderInfo({
        userId: user?.id || 0,
        totalAmount: total,
        deliveryAddress: "Chưa có địa chỉ"
      }));

      router.push("/order");
    } catch (error) {
      console.error("Error proceeding to payment:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-[#858787]">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🛒</div>
        <h3 className="text-2xl font-bold text-white mb-4">Your cart is empty</h3>
        <p className="text-[#858787] mb-8 max-w-md mx-auto">
          Looks like you haven't added any delicious dishes to your cart yet.
          Explore our menu and find something amazing!
        </p>
        <Link href="/menu">
          <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105">
            <ShoppingBag className="mr-2" size={18} />
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-[#F26D16]" size={24} />
              <h2 className="text-2xl font-bold text-white">Cart Items ({cartItems.length})</h2>
            </div>
            {cartItems.length > 0 && (
              <Button
                onClick={clearAllItems}
                className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full px-4 py-2 text-sm transition-all duration-300"
              >
                <Trash2 className="mr-2" size={14} />
                Clear All
              </Button>
            )}
          </div>

          {/* Select All Section */}
          {cartItems.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A] mb-4">
              <Checkbox
                id="select-all"
                checked={isSelectAll}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-[#F26D16] data-[state=checked]:border-[#F26D16]"
              />
              <label
                htmlFor="select-all"
                className="text-white font-semibold cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="text-[#F26D16]" size={18} />
                Select all items ({cartItems.length})
              </label>
              {selectedItems.size > 0 && (
                <span className="text-[#F26D16] text-sm ml-auto">
                  {selectedItems.size} item(s) selected
                </span>
              )}
            </div>
          )}

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-xl border transition-all duration-300 ${selectedItems.has(item.id)
                    ? 'border-[#F26D16]/50 bg-[#F26D16]/5'
                    : 'border-[#3A3A3A] hover:border-[#F26D16]/30'
                  }`}
              >
                {/* Selection Checkbox */}
                <Checkbox
                  id={`item-${item.id}`}
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                  className="data-[state=checked]:bg-[#F26D16] data-[state=checked]:border-[#F26D16]"
                />

                {/* Item Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-[#F26D16] font-bold text-xl">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-[#858787] text-sm">
                    {item.ingredients?.length || 0} ingredients
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-[#2A2A2A] hover:bg-[#F26D16] text-white rounded-full p-0 transition-all duration-300"
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="text-white font-semibold text-lg w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-[#2A2A2A] hover:bg-[#F26D16] text-white rounded-full p-0 transition-all duration-300"
                  >
                    <Plus size={14} />
                  </Button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full p-0 transition-all duration-300"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6 pt-6 border-t border-[#3A3A3A]">
            <Link href="/menu">
              <Button className="bg-transparent border border-[#F26D16] text-[#F26D16] hover:bg-[#F26D16] hover:text-white rounded-full px-6 py-2 transition-all duration-300">
                <ShoppingBag className="mr-2" size={16} />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A] sticky top-8">
          <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

          {/* Selection Status */}
          <div className="mb-4 p-3 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
            <div className="flex items-center gap-2 text-[#F26D16]">
              <CheckCircle2 size={18} />
              <span className="font-semibold">
                {selectedItems.size} of {cartItems.length} items selected
              </span>
            </div>
            {selectedItems.size === 0 && (
              <p className="text-[#858787] text-sm mt-1">
                Select items to see total price
              </p>
            )}
          </div>

          {/* Price Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[#858787]">
              <span>Subtotal ({selectedItems.size} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#858787]">
              <span>Delivery Fee</span>
              <span>{selectedItems.size > 0 ? formatPrice(deliveryFee) : formatPrice(0)}</span>
            </div>
            <div className="border-t border-[#3A3A3A] pt-3">
              <div className="flex justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span className="text-[#F26D16]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Order Items Preview */}
          {selectedItems.size > 0 && (
            <div className="mb-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
              <h3 className="text-white font-semibold mb-3">Selected Items:</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedCartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#858787] truncate max-w-[150px]">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-[#F26D16] font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="mb-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A]">
            <h3 className="text-white font-semibold mb-2">Customer</h3>
            <p className="text-[#858787] text-sm">
              Guest User
            </p>
          </div>

          {/* Proceed to Order Button */}
          {selectedItems.size > 0 ? (
              <Button onClick={() => handleProceedToPayment()} className="w-full bg-[#F26D16] hover:bg-orange-600 text-white rounded-xl py-5 font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
                Proceed to Payment
              </Button>
          ) : (
            <Button
              disabled
              className="w-full bg-gray-500 text-gray-300 rounded-xl py-3 font-semibold text-lg cursor-not-allowed"
            >
              <AlertCircle className="mr-2" size={18} />
              Select items to proceed
            </Button>
          )}

          {/* Security Note */}
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-green-400 text-xs text-center">
              🔒 Secure checkout with multiple payment options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}