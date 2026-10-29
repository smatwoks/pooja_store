
/* eslint-disable react/prop-types */
import { CiStopwatch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { validURLConvertor } from "../utils/validURLConvertor";
import AddToCartButton from "./AddToCartButton";

function ProductCard({ data }) {
    const formattedUnit = /^\d+$/.test(data?.unit)
        ? `${data.unit} Unit`
        : data.unit;

    const url = `/products-list/${validURLConvertor(data.name)}-${data._id}`;

    const discountedPrice =
        data.price - (data.price * data.discount) / 100;

    return (
        <Link
            to={url}
            className="relative grid min-w-36 gap-2 rounded-xl border border-[#e8d4a7] bg-[#fffdf7] p-2 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c69b43] hover:shadow-md lg:min-w-52 lg:gap-3 lg:p-4"
        >
            {data.discount > 0 && (
                <div className="absolute left-2 top-2 z-10 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-[#c69b43] bg-[#741d29] text-[10px] font-bold leading-tight text-[#ffe7a4] shadow-sm">
                    <span>{data.discount}%</span>
                    <span>OFF</span>
                </div>
            )}

            <div className="h-28 rounded-lg bg-white p-1 lg:h-32">
                <img
                    src={data.image?.[0]}
                    alt={data.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-200 hover:scale-105"
                />
            </div>

            <div className="mt-1 flex w-fit items-center gap-1 rounded-md bg-[#f8efd9] px-2 py-1 text-[#741d29]">
                <CiStopwatch size={14} />
                <span className="text-[10px] font-semibold">8 MINS</span>
            </div>

            <div className="line-clamp-2 min-h-10 text-sm font-bold text-[#401a18]">
                {data.name}
            </div>

            <div className="text-xs text-[#806b55]">
                {formattedUnit}
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {data.discount > 0 && (
                    <span className="text-xs text-[#927f6c] line-through">
                        ₹{data.price}
                    </span>
                )}

                <span className="text-sm font-extrabold text-[#741d29]">
                    ₹{data.discount > 0
                        ? discountedPrice.toFixed(2)
                        : data.price}
                </span>
            </div>

            <div className="mt-1" onClick={(event) => event.preventDefault()}>
                <AddToCartButton data={data} />
            </div>
        </Link>
    );
}

export default ProductCard;
