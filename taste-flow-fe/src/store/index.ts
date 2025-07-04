import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./slice/slice-order";
import cartSlice from "./slice/slice-cart";




const store = configureStore({
    reducer: {
       order: orderSlice.reducer,
       cart: cartSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export default store

