import { OrderInfo, OrderItem, OrderState } from '@/utils/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: OrderState = {
  order: null,
  orderItemList: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderInfo: (state, action: PayloadAction<OrderInfo>) => {
      state.order = action.payload;
    },
    setOrderItems: (state, action: PayloadAction<OrderItem[]>) => {
      state.orderItemList = action.payload;
    },
    addOrderItem: (state, action: PayloadAction<OrderItem>) => {
      state.orderItemList.push(action.payload);
    },
    clearOrder: () => initialState,
  },
});

export const {
  setOrderInfo,
  setOrderItems,
  addOrderItem,
  clearOrder,
} = orderSlice.actions;

export default orderSlice;
