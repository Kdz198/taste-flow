import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ItemAddRequest {
  userId: string;
  itemAddCart: Record<string, number>; // itemId => quantity
}

const initialState: ItemAddRequest = {
  userId: "",
  itemAddCart: {},
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },

    addToCart: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      if (state.itemAddCart[itemId]) {
        state.itemAddCart[itemId] += quantity;
      } else {
        state.itemAddCart[itemId] = quantity;
      }
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.itemAddCart[itemId];
      } else {
        state.itemAddCart[itemId] = quantity;
      }
    },

    removeFromCart: (state, action: PayloadAction<{ itemId: string }>) => {
      delete state.itemAddCart[action.payload.itemId];
    },

    clearCart: (state) => {
      state.itemAddCart = {};
    },
  },
});

export const {
  setUserId,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = orderSlice.actions;

export default orderSlice;
