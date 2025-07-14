import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type RemoveCartState = {
  itemsToRemove: {
    [productId: string]: number
  }
}

const initialState: RemoveCartState = {
  itemsToRemove: {},
}

const removeCartSlice = createSlice({
  name: 'cartRemove',
  initialState,
  reducers: {
    queueRemoveItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      state.itemsToRemove[productId] = (state.itemsToRemove[productId] || 0) + quantity
    },
    clearRemoveQueue: () => initialState,
  },
})

export const { queueRemoveItem, clearRemoveQueue } = removeCartSlice.actions
export default removeCartSlice
