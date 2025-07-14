import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AddCartState = {
  itemsToAdd: {
    [productId: string]: number
  }
}

const initialState: AddCartState = {
  itemsToAdd: {},
}

const addCartSlice = createSlice({
  name: 'cartAdd',
  initialState,
  reducers: {
    queueAddItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      state.itemsToAdd[productId] = (state.itemsToAdd[productId] || 0) + quantity
    },
    clearAddQueue: () => initialState,
  },
})

export const { queueAddItem, clearAddQueue } = addCartSlice.actions
export default addCartSlice
