
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useCallback, useEffect, useRef, useState } from "react";
import CardLoadingSkeleton from "./CardLoadingSkeleton";
import ProductCard from "./ProductCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function ProductViewByCategory({ id, name }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    const fetchProductsByCategory = useCallback(async (showLoading = false) => {
        if (!id) return;

        try {
            if (showLoading) setLoading(true);

            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data: { id },
            });

            if (response?.data?.success) {
                setData(Array.isArray(response.data.data) ? response.data.data : []);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProductsByCategory(true);

        // Refresh products every 15 seconds to reflect admin changes.
        const intervalId = setInterval(() => {
            fetchProductsByCategory(false);
        }, 15000);

        // Refresh when the customer returns to this browser tab.
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchProductsByCategory(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchProductsByCategory]);

    const scrollLeft = () => {
        containerRef.current?.scrollBy({
            left: -600,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        containerRef.current?.scrollBy({
            left: 600,
            behavior: "smooth",
        });
    };

    return (
        <section className="mb-6">
            <div className="mx-auto flex items-center justify-between gap-3">
                <h2 className="mb-3 text-lg font-bold">{name}</h2>

                <Link
                    to={`/all-products-by-category/${id}`}
                    state={{ categoryId: id }}
                    className="text-xl font-semibold text-[#0C831F]"
                >
                    See all
                </Link>
            </div>

            <div className="relative w-full">
                <button
                    type="button"
                    onClick={scrollLeft}
                    aria-label={`Scroll ${name} products left`}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-md hover:bg-gray-100"
                >
                    <FaAngleLeft />
                </button>

                <div
                    ref={containerRef}
                    className="container mx-auto flex gap-4 overflow-x-auto whitespace-nowrap py-4 md:gap-5 lg:gap-6"
                >
                    {loading &&
                        Array.from({ length: 5 }).map((_, index) => (
                            <CardLoadingSkeleton key={index} />
                        ))}

                    {!loading &&
                        data
                            .filter((product) => product.stock !== 0)
                            .slice(0, 15)
                            .map((product) => (
                                <ProductCard data={product} key={product._id} />
                            ))}
                </div>

                <button
                    type="button"
                    onClick={scrollRight}
                    aria-label={`Scroll ${name} products right`}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-md hover:bg-gray-100"
                >
                    <FaAngleRight />
                </button>
            </div>
        </section>
    );
}

export default ProductViewByCategory;
