
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyForgotPasswordOTP from "../pages/VerifyForgotPasswordOTP";
import ResetPassword from "../pages/ResetPassword";
import UserMenuForMobileUser from "../pages/UserMenuForMobileUser";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import UploadProduct from "../pages/UploadProduct";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import ProductsAdmin from "../pages/ProductsAdmin";
import ProtectedRoute from "../components/ProtectedRoute";
import UpdateProduct from "../pages/UpdateProduct";
import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails";
import AllProductsByCategory from "../components/AllProductsByCategory";
import ViewCart from "../pages/ViewCart";
import AdminOverview from "../pages/AdminOverview";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      {
        path: "verify-forgot-password-otp",
        element: <VerifyForgotPasswordOTP />,
      },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "user-menu", element: <UserMenuForMobileUser /> },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
            {
  index: true,
  element: (
    <ProtectedRoute
      element={<AdminOverview />}
      allowedRoles={["ADMIN"]}
    />
  ),
},
          { path: "profile", element: <Profile /> },
          {
            path: "products",
            element: (
              <ProtectedRoute
                element={<ProductsAdmin />}
                allowedRoles={["ADMIN"]}
              />
            ),
          },
          {
            path: "upload-product",
            element: (
              <ProtectedRoute
                element={<UploadProduct />}
                allowedRoles={["ADMIN"]}
              />
            ),
          },
          {
            path: "category",
            element: (
              <ProtectedRoute
                element={<Category />}
                allowedRoles={["ADMIN"]}
              />
            ),
          },
          {
            path: "sub-category",
            element: (
              <ProtectedRoute
                element={<SubCategory />}
                allowedRoles={["ADMIN"]}
              />
            ),
          },
          {
            path: "update-product/:id",
            element: (
              <ProtectedRoute
                element={<UpdateProduct />}
                allowedRoles={["ADMIN"]}
              />
            ),
          },
        ],
      },
      {
        path: "products-list/:product",
        element: <ProductDetails />,
      },
      {
        path: "products-list/:categoryId/:subCategoryId",
        element: <ProductList />,
      },
      {
        path: "all-products-by-category/:categoryId",
        element: <AllProductsByCategory />,
      },
      { path: "cart", element: <ViewCart /> },
    ],
  },
]);

export default router;
