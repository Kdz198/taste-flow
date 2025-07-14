import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slice/slice-cart";
import removeCartSlice from "./slice/slice-remove-cart";
import addCartSlice from "./slice/slice-add-cart";
import orderSlice from "./slice/slice-order";




const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        cartAdd: addCartSlice.reducer,
        cartRemove: removeCartSlice.reducer,
        order: orderSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export default store

