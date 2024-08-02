import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AccountPage from "./pages/AccountPage/AccountPage";
import AccountInfomation from "./components/Accout/AccountInfomation";
import ChangePassword from "./components/Accout/ChangePassword";
import MyOrderPage from "./components/MyOrderPage/MyOrderPage";
import LoginLayout from "./Layout/LoginLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Spinner from "./components/Spinner/Spinner";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/Home/HomePage";
import Layout from "./Layout/Layout";
import DetailPage from "./pages/DetailPage/DetailPage";
import LayoutAdmin from "./Layout/LayoutAdmin";
import ProductsList from "./pages/admin/Product/ProductsList";
import AddProduct from "./pages/admin/Product/AddProduct";
import UpdateProduct from "./pages/admin/Product/UpdateProduct";
import ProductDetail from "./pages/admin/Product/ProductDetail";
import ReviewList from "./pages/admin/Review/ReviewList";
import UsersList from "./pages/admin/User/UsersList";
import AddUser from "./pages/admin/User/AddUser";
import UpdateUser from "./pages/admin/User/UpdateUser";
import UserDetail from "./pages/admin/User/UserDetail";
import MyShippingAddress from "./components/Accout/ShipingAddress/MyShippingAddress";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import { isAccessTokenValid, refreshToken } from "./util/token";
import { useEffect } from "react";
import "./custom-input.css";
import CartList from "./pages/CartPage/CartList";
import OrderPage from "./pages/OrderPage/OrderPage";
import OrderDetail from "./pages/OrderPage/OrderDetail";
import OrderAdmin from "./pages/admin/Order/OrderAdmin";
import OrderDetailAdmin from "./pages/admin/Order/OrderDetailAdmin";
import ListProductPage from "./pages/ListProductPage/ListProductPage";
import CategoryList from "./pages/admin/Category/CategoryList";
import AddCategory from "./pages/admin/Category/AddCategory";
import UpdateCategory from "./pages/admin/Category/UpdateCategory";
import VoucherList from "./pages/admin/Voucher/VoucherList";
import AddVoucher from "./pages/admin/Voucher/AddVoucher";
import UpdateVoucher from "./pages/admin/Voucher/UpdateVoucher";
import UpdateAttributeProduct from "./pages/admin/Product/UpdateAttributeProduct";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const vnpay = queryParams.get("vnp_BankCode");

  useEffect(() => {
    if (vnpay) {
      navigate("/order");
    }
  }, []);

  useEffect(() => {
    if (!isAccessTokenValid()) {
      refreshToken();
    }
  }, []);

  return (
    <>
      <Spinner />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* account */}
          <Route path="account" element={<AccountPage />}>
            <Route index element={<AccountInfomation />} />
            <Route path="shipping-address" element={<MyShippingAddress />} />
            <Route path="updatepassword" element={<ChangePassword />} />
            <Route path="myorder" element={<MyOrderPage />} />
          </Route>
          <Route path="detail/:slug" element={<DetailPage />} />
          {/* <Route path="details/:slug" element={<DetailProduct />} /> */}
          {/* <Route path="products" element={<ProductListPage />} /> */}
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="carts" element={<CartList />} />
          <Route path="order/:id" element={<OrderDetail />} />
          <Route path="order" element={<OrderPage />} />
          {/* <Route path="detail" element={<DetailProduct />} /> */}
          <Route path="products" element={<ListProductPage />} />
        </Route>
        <Route path="/auth" element={<LoginLayout />}>
          <Route path="verify-email/:token" element={<ResetPassword />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="products" element={<ProductsList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/update/:id" element={<UpdateProduct />} />
          <Route path="products/update/attributes/:id" element={<UpdateAttributeProduct />} />
          <Route path="reviews/:id" element={<ReviewList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/update/:id" element={<UpdateUser />} />
          <Route path="order" element={<OrderAdmin />} />
          <Route path="order/:id" element={<OrderDetailAdmin />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/update/:id" element={<UpdateCategory />} />
          <Route path="voucher" element={<VoucherList />} />
          <Route path="voucher/add" element={<AddVoucher />} />
          <Route path="voucher/update/:id" element={<UpdateVoucher />} />
        </Route>
        {/* Các route khác nếu có */}
      </Routes>
    </>
  );
}

export default App;
