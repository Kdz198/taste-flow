import { ItemToAdd, ItemsToAddPayload } from "@/utils/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ItemsToAddPayload = {
  itemsToAdd: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ItemToAdd>) => {
      const { itemId, quantity } = action.payload;
      const index = state.itemsToAdd.findIndex((item) => item.itemId === itemId);

      if (index !== -1) {
        state.itemsToAdd[index].quantity += quantity;
      } else {
        state.itemsToAdd.push(action.payload);
      }
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const index = state.itemsToAdd.findIndex((item) => item.itemId === itemId);

      if (index !== -1) {
        if (quantity <= 0) {
          state.itemsToAdd.splice(index, 1);
        } else {
          state.itemsToAdd[index].quantity = quantity;
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<{ itemId: string }>) => {
      state.itemsToAdd = state.itemsToAdd.filter(
        (item) => item.itemId !== action.payload.itemId
      );
    },

    clearCart: (state) => {
      state.itemsToAdd = [];
    },
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice;
