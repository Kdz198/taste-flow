# 🔧 Cart Logic Fix - Summary

## ❌ **Lỗi trước đây:**

1. **Conflict Redux Slices:**
   ```tsx
   // Import từ slice-order nhưng dùng state.cart
   import { updateCartItemQuantity, removeFromCart, clearCart } from '@/store/slice/slice-order';
   const {itemsToAdd} = useSelector((state: RootState) => state.cart);
   const { itemAddCart, userId } = useSelector((state: RootState) => state.order);
   ```

2. **Logic không nhất quán:**
   - `fetchCartItems()` sử dụng `itemAddCart` (object format)
   - `render()` sử dụng `itemsToAdd` (array format)
   - Actions dispatch vào slice-order thay vì slice-cart

3. **Data structure mismatch:**
   - `itemAddCart`: `Record<string, number>` (itemId -> quantity)
   - `itemsToAdd`: `ItemToAdd[]` (array of objects with itemId, name, price, quantity)

## ✅ **Đã sửa:**

1. **Single Source of Truth:**
   ```tsx
   // Chỉ dùng slice-cart
   import { updateCartItemQuantity, removeFromCart, clearCart } from '@/store/slice/slice-cart';
   const { itemsToAdd } = useSelector((state: RootState) => state.cart);
   ```

2. **Consistent Data Flow:**
   ```tsx
   // Fetch products based on itemsToAdd array
   const itemsWithDetails = itemsToAdd.map((cartItem) => {
       const product = allProducts.find((p: FoodType) => p._id === cartItem.itemId);
       return product ? { ...product, quantity: cartItem.quantity } : null;
   }).filter(Boolean) as CartItem[];
   ```

3. **Unified Item IDs:**
   ```tsx
   // Sử dụng item._id thay vì item.itemId
   selectedItems.has(item._id)
   updateQuantity(item._id, item.quantity - 1)
   removeItem(item._id)
   ```

## 🎯 **Logic Flow hiện tại:**

1. **Cart State:** `itemsToAdd[]` từ slice-cart
2. **Fetch Details:** Lấy product details từ API dựa trên itemsToAdd
3. **Selection:** Dùng product._id để track selected items
4. **Actions:** Dispatch vào slice-cart với itemId
5. **Price Calculation:** Dựa trên selected items with product details

## 🔄 **Data Flow:**

```
Menu → addToCart(ItemToAdd) → slice-cart.itemsToAdd[]
  ↓
Cart → fetchCartItems() → merge with product details
  ↓  
User Selection → selectedItems Set<productId>
  ↓
Order Summary → calculate total for selected items
  ↓
Proceed to Order → pass selectedItems + total via URL
```

Bây giờ Cart logic đã nhất quán và hoạt động đúng!
