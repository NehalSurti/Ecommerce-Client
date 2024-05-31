import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import userReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/order/orderSlice";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  product: productReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
  order: orderReducer,
});

export default rootReducer;
