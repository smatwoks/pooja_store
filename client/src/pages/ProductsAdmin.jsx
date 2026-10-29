
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  PackageSearch,
} from "lucide-react";

import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import summaryApi from "../common/summaryApi";
import ProductCardAdmin from "./ProductCardAdmin";

function ProductsAdmin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const limit = 10;

  const fetchProductsData = useCallback(
    async (showRefresh = false) => {
      try {
        setLoadError("");
        setLoading(!showRefresh);
        setRefreshing(showRefresh);

        const response = await Axios({
          ...summaryApi.getProduct,
          data: {
            page: pageNum,
            limit,
            search: search.trim(),
          },
        });

        if (!response?.data?.success) {
          throw new Error(
            response?.data?.message || "Unable to load products."
          );
        }

        const result = response.data.data;

        const productList = Array.isArray(result)
          ? result
          : Array.isArray(result?.products)
            ? result.products
            : [];

        const pages = Number(
          response.data.totalNoPage ??
          result?.totalNoPage ??
          1
        );

        setProducts(productList);
        setTotalPages(Math.max(1, pages));
      } catch (error) {
        setLoadError(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load products. Please try again."
        );
        AxiosToastError(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pageNum, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProductsData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchProductsData]);

  const handleSearch = (value) => {
    setSearch(value);
    setPageNum(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === pageNum) return;
    setPageNum(page);
  };

  return (
    <section className="min-h-full bg-[#f7f9f5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
              <Package size={17} />
              <span>Inventory management</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Product Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your products, update details, and keep your catalog
              organized.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/upload-product")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0c831f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <Plus size={19} />
            Add New Product
          </button>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Package size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Products on this page
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {loading ? "—" : products.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search and refresh */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search products by name..."
                aria-label="Search products"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="button"
              onClick={() => fetchProductsData(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              Showing up to {limit} products per page
            </span>
            <span>
              Page {pageNum} of {totalPages}
            </span>
          </div>
        </div>

        {/* Error state */}
        {loadError && !loading && products.length === 0 && (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <AlertCircle
              size={35}
              className="mx-auto mb-3 text-red-500"
            />
            <h2 className="font-semibold text-gray-900">
              Could not load products
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => fetchProductsData(true)}
              className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Product list */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                    <div className="h-8 w-24 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCardAdmin
                  key={product._id}
                  data={product}
                  fetchProductsData={fetchProductsData}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page <span className="font-semibold text-gray-900">{pageNum}</span>{" "}
                of <span className="font-semibold text-gray-900">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(pageNum - 1)}
                  disabled={pageNum <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span className="min-w-10 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-bold text-green-800">
                  {pageNum}
                </span>

                <button
                  type="button"
                  onClick={() => goToPage(pageNum + 1)}
                  disabled={pageNum >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        ) : !loadError ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <PackageSearch size={32} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-gray-900">
              {search.trim() ? "No matching products" : "No products yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {search.trim()
                ? "Try another search term to find the product you're looking for."
                : "Add your first product to start building your store catalog."}
            </p>

            {search.trim() ? (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="mt-5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/dashboard/upload-product")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0c831f] px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                <Plus size={18} />
                Add your first product
              </button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ProductsAdmin;
