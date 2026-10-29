
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers3,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    title: "Manage Products",
    description: "View, search, edit, and delete existing products.",
    icon: Package,
    to: "/dashboard/products",
    action: "View products",
  },
  {
    title: "Add Product",
    description: "Add a new grocery item to your catalog.",
    icon: PlusCircle,
    to: "/dashboard/upload-product",
    action: "Add product",
  },
  {
    title: "Categories",
    description: "Organize your products into categories.",
    icon: Tags,
    to: "/dashboard/category",
    action: "Manage categories",
  },
  {
    title: "Subcategories",
    description: "Manage subcategories for your catalog.",
    icon: Layers3,
    to: "/dashboard/sub-category",
    action: "Manage subcategories",
  },
];

function AdminOverview() {
  return (
    <div className="min-h-full bg-[#f8faf8] p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-green-700">
            BLINKIT ADMIN
          </p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your grocery catalog from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
          <ShieldCheck size={18} />
          Administrator
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-[#0c831f] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <LayoutDashboard size={22} />
              <span className="text-sm font-medium text-green-100">
                Admin workspace
              </span>
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Your store, your control.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-50">
              Keep your product catalog organized, update prices, and manage
              categories using the tools below.
            </p>
          </div>

          <Link
            to="/dashboard/upload-product"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-green-800 transition hover:bg-green-50"
          >
            <PlusCircle size={19} />
            Add a product
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Catalog management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose an action to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.title}
              to={section.to}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Icon size={24} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>

              <p className="mt-2 min-h-10 text-sm leading-6 text-gray-500">
                {section.description}
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-green-700">
                {section.action}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Catalog safety
        </p>
        <p className="mt-1 text-sm leading-6 text-amber-800">
          Only make catalog changes when logged in as an administrator.
          Product and category changes should be protected by your backend
          authorization checks.
        </p>
      </div>
    </div>
  );
}

export default AdminOverview;
