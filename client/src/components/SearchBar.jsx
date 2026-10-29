
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";
import { FaArrowLeftLong } from "react-icons/fa6";

function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false);
    const [isMobile] = useMobile();

    useEffect(() => {
        setIsSearchPage(location.pathname === "/search");
    }, [location.pathname]);

    const searchItems = [
        "pooja items",
        "brass deepam",
        "camphor",
        "incense sticks",
        "flowers",
        "pooja thali",
        "tulsi mala",
        "kumkum",
    ];

    const sequence = searchItems.flatMap((item) => [
        `Search "${item}"`,
        1500,
    ]);

    const redirectToSearchPage = () => {
        navigate("/search");
    };

    const handleOnChange = (event) => {
        navigate(`/search?q=${encodeURIComponent(event.target.value)}`);
    };

    return (
        <div className="flex h-11 w-full min-w-0 items-center overflow-hidden rounded-xl border border-[#c69b43] bg-[#fffdf7] shadow-sm transition focus-within:ring-2 focus-within:ring-[#c69b43] lg:h-12">
            <div className="flex h-full shrink-0 items-center">
                {isSearchPage && isMobile ? (
                    <Link
                        to="/"
                        aria-label="Back to home"
                        className="flex h-full items-center px-3 text-[#741d29]"
                    >
                        <FaArrowLeftLong size={20} />
                    </Link>
                ) : (
                    <button
                        type="button"
                        aria-label="Search"
                        onClick={redirectToSearchPage}
                        className="flex h-full items-center px-3 text-[#741d29]"
                    >
                        <IoSearch size={22} />
                    </button>
                )}
            </div>

            <div className="flex h-full min-w-0 flex-1 items-center pr-3">
                {!isSearchPage ? (
                    <button
                        type="button"
                        onClick={redirectToSearchPage}
                        className="w-full truncate text-left text-sm text-[#806b55]"
                    >
                        <TypeAnimation
                            sequence={sequence}
                            wrapper="span"
                            cursor
                            repeat={Infinity}
                        />
                    </button>
                ) : (
                    <input
                        type="search"
                        placeholder="Search pooja items and categories..."
                        aria-label="Search products"
                        className="h-full w-full min-w-0 bg-transparent text-sm text-[#401a18] outline-none placeholder:text-[#a18c75]"
                        autoFocus
                        defaultValue={
                            new URLSearchParams(location.search).get("q") || ""
                        }
                        onChange={handleOnChange}
                    />
                )}
            </div>
        </div>
    );
}

export default SearchBar;
