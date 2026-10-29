
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  Tags,
  Layers3,
  PlusCircle,
  UserCircle,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

function DashBoardLeftSide() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Products",
      to: "/dashboard/products",
      icon: Package,
    },
    {
      label: "Add Product",
      to: "/dashboard/upload-product",
      icon: PlusCircle,
    },
    {
      label: "Categories",
      to: "/dashboard/category",
      icon: Tags,
    },
    {
      label: "Subcategories",
      to: "/dashboard/sub-category",
      icon: Layers3,
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await Axios(summaryApi.logout);

      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message || "Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const isActive = (item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`);

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <Link to="/dashboard" className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#f8cb46]">blink</span>
          <span className="text-[#0c831f]">it</span>
        </Link>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-green-700"
        >
          <ArrowLeft size={16} />
          Store
        </button>
      </div>

      <div className="flex items-center gap-3 border-b border-gray-100 p-4">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Admin avatar"
            className="h-11 w-11 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <UserCircle size={42} className="shrink-0 text-gray-400" />
        )}

        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">
            {user?.name || "Administrator"}
          </p>
          <p className="truncate text-xs text-gray-500">{user?.email}</p>
          <p className="mt-1 text-xs font-semibold text-green-700">
            {user?.role === "ADMIN" ? "Administrator" : "Account"}
          </p>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Store management
        </p>

        {user?.role === "ADMIN" &&
          menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-green-50 text-green-800"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-800"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashBoardLeftSide;
