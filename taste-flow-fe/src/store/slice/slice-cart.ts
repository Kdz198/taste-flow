import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartState = {
  userId: number | null;
  items: {
    [productId: string]: number; // productId: quantity
  };
  quantity: number; // tổng quantity
};

const initialState: CartState = {
  userId: null,
  items: {},
  quantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thiết lập lại toàn bộ cart (dùng sau khi fetch từ API)
    setCart: (state, action: PayloadAction<CartState>) => {
      return { ...action.payload };
    },

    // Clear toàn bộ cart (thường dùng khi logout hoặc đặt hàng xong)
    clearCart: () => initialState,

    // ✅ Chỉ gọi sau khi API add thành công
    addItemLocal: (
      state,
      action: PayloadAction<{ productId: string; quantity?: number }>
    ) => {
      const { productId, quantity = 1 } = action.payload;
      if (!state.items[productId]) {
        state.items[productId] = quantity;
      } else {
        state.items[productId] += quantity;
      }
      state.quantity += quantity;
    },

    // ✅ Chỉ gọi sau khi API remove thành công
    removeItemLocal: (
      state,
      action: PayloadAction<{ productId: string; quantity?: number }>
    ) => {
      const { productId, quantity = 1 } = action.payload;
      if (!state.items[productId]) return;

      const newQty = state.items[productId] - quantity;
      if (newQty <= 0) {
        state.quantity -= state.items[productId];
        delete state.items[productId];
      } else {
        state.items[productId] = newQty;
        state.quantity -= quantity;
      }

      if (state.quantity < 0) {
        state.quantity = 0;
      }
    },

    // ✅ Dễ dùng trong UI để set lại số lượng mới trực tiếp
    updateItemQuantityLocal: (
      state,
      action: PayloadAction<{ productId: string; newQuantity: number }>
    ) => {
      const { productId, newQuantity } = action.payload;
      const prevQuantity = state.items[productId] || 0;

      if (newQuantity <= 0) {
        delete state.items[productId];
      } else {
        state.items[productId] = newQuantity;
      }

      state.quantity += newQuantity - prevQuantity;
      if (state.quantity < 0) state.quantity = 0;
    },
  },
});

export const {
  setCart,
  clearCart,
  addItemLocal,
  removeItemLocal,
  updateItemQuantityLocal,
} = cartSlice.actions;

export default cartSlice;
