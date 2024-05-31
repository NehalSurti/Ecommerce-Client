import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { useSelector } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import Wishlist from "./pages/Wishlist";
import AllProducts from "./components/AllProducts";
import WithFilterLayout from "./components/WithFilterLayout";
import { checkAuthAsync } from "./redux/features/auth/authThunks";
import { useDispatch } from "react-redux";
import UserRequestResponseInterceptor from "./utils/requestMethods";
import { getWishlistAsync } from "./redux/features/wishlist/wishlistThunks";
import WithFilterLayoutCopy from "./components/WithFilterLayout copy";
import ProductsCopy from "./components/ProductsCopy";
import Checkout from "./pages/Checkout";
import { getCartAsync } from "./redux/features/cart/cartThunks";
import Orders from "./pages/Orders";
import { getOrdersAsync } from "./redux/features/order/orderThunks";
import StripeCheckout from "./pages/StripeCheckout";

function App() {
  const dispatch = useDispatch();
  const [userChecked, setUserChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    setLoading(true);
    async function tokenCheck() {
      try {
        const authStatus = await dispatch(
          checkAuthAsync({ TOKEN: user.token, id: user._id })
        );

        if (authStatus.payload) {
          setUserChecked(true);
        } else {
          setUserChecked(false);
        }
      } catch (error) {
        setUserChecked(false);
      } finally {
        setLoading(false);
      }
    }
    tokenCheck();
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(getWishlistAsync(user._id));
      dispatch(getCartAsync(user._id));
      dispatch(getOrdersAsync(user._id));
    }
  }, [user]);

  return (
    <>
      <ScrollToTop>
        <Routes>
          {user && userChecked && (
            <>
              <Route
                path="/products/:category"
                element={
                  <WithFilterLayout>
                    <ProductsCopy></ProductsCopy>
                  </WithFilterLayout>
                }
              />
              <Route
                path="/products"
                element={
                  <WithFilterLayoutCopy>
                    <AllProducts></AllProducts>
                  </WithFilterLayoutCopy>
                }
              />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/stripe-checkout" element={<StripeCheckout />} />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/" /> : <Register />}
              />
              <Route path="/success/:orderId" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          )}
          {!loading && (!user || !userChecked) && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
        <UserRequestResponseInterceptor></UserRequestResponseInterceptor>
      </ScrollToTop>
    </>
  );
}

export default App;
