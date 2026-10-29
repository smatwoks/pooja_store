
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useMobile from "../hooks/useMobile";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import UserMenu from "./UserMenu";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

function Header({ setIsCartMenuOpen }) {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";
    const navigate = useNavigate();

    const cartItem = useSelector((state) => state.cartItem.cart);
    const user = useSelector((state) => state?.user);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [userData, setUserData] = useState(user);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const itemsCount = cartItem.reduce(
            (prev, curr) => prev + curr.quantity,
            0
        );

        const priceCount = parseFloat(
            cartItem.reduce(
                (prev, curr) =>
                    prev +
                    curr.productId.price *
                        (1 - curr.productId.discount / 100) *
                        curr.quantity,
                0
            ).toFixed(2)
        );

        setTotalItems(itemsCount);
        setTotalPrice(priceCount);
    }, [cartItem]);

    useEffect(() => {
        setOpenUserMenu(false);
        setUserData(user);
    }, [user]);

    const handleMobileUser = () => {
        if (!user?._id) {
            setIsLoginOpen(true);
            return;
        }

        navigate("/user-menu");
    };

    return (
        <header className="fixed top-0 left-0 z-40 min-h-28 w-full border-b border-[#d8bd8a] bg-[#fffaf0] shadow-sm lg:h-[88px] lg:min-h-0">
            {!(isSearchPage && isMobile) && (
                <div className="container mx-auto flex items-center justify-between gap-3 px-3 py-2 sm:px-5 lg:max-w-full lg:px-6">
                    {/* Store logo and name */}
                    <Link
                        to="/"
                        className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
                        aria-label="Venkateswara Pooja Store home"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#c69b43] bg-[#641b25] text-xl text-[#f7d98b] shadow-sm sm:h-14 sm:w-14">
                            ॐ
                        </div>

                        <div className="min-w-0 leading-tight">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d692d] sm:text-xs">
                                Sri Venkateswara
                            </p>
                            <p className="text-sm font-extrabold text-[#741d29] sm:text-lg lg:text-xl">
                                Pooja Store
                            </p>
                            <p className="hidden text-[10px] text-[#8d692d] sm:block">
                                All your pooja essentials
                            </p>
                        </div>
                    </Link>

                    {/* Desktop search */}
                    {location.pathname !== "/checkout" && (
                        <div className="hidden min-w-0 flex-1 px-4 lg:block">
                            <SearchBar />
                        </div>
                    )}

                    {/* Account and cart */}
                    <div
                        className={`${
                            location.pathname === "/checkout"
                                ? "hidden"
                                : "flex items-center gap-3 sm:gap-4 lg:gap-5"
                        }`}
                    >
                        <button
                            type="button"
                            className="text-[#741d29] lg:hidden"
                            onClick={handleMobileUser}
                            aria-label="Account"
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="User avatar"
                                    className="h-9 w-9 rounded-full border border-[#d8bd8a] object-cover"
                                />
                            ) : (
                                <FaUserCircle size={26} />
                            )}
                        </button>

                        {user?._id ? (
                            <div className="relative hidden select-none lg:block">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#641b25] transition hover:bg-[#f3e5c7]"
                                    onClick={() =>
                                        setOpenUserMenu((prev) => !prev)
                                    }
                                >
                                    <span className="font-semibold">Account</span>
                                    {openUserMenu ? (
                                        <IoMdArrowDropup size={22} />
                                    ) : (
                                        <IoMdArrowDropdown size={22} />
                                    )}
                                </button>

                                {openUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 min-w-52 rounded-xl border border-[#ead9b5] bg-white p-4 shadow-xl">
                                        <UserMenu
                                            closeMenu={() => setOpenUserMenu(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoginOpen(true);
                                    setIsRegister(false);
                                }}
                                className="hidden rounded-lg px-3 py-2 font-semibold text-[#641b25] transition hover:bg-[#f3e5c7] lg:block"
                            >
                                Login
                            </button>
                        )}

                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg border border-[#8d2734] bg-[#741d29] px-3 py-2 text-white shadow-sm transition hover:bg-[#54131c] sm:min-w-28 sm:justify-center"
                            onClick={() => {
                                if (user?._id) {
                                    setIsCartMenuOpen(true);
                                } else {
                                    setIsLoginOpen(true);
                                    setIsRegister(false);
                                }
                            }}
                        >
                            <HiOutlineShoppingCart size={25} />

                            <span className="hidden text-left text-xs font-bold sm:block">
                                {cartItem.length > 0 ? (
                                    <>
                                        <span className="block">
                                            {totalItems} items
                                        </span>
                                        <span className="block text-[#f7d98b]">
                                            ₹{totalPrice.toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    "My Cart"
                                )}
                            </span>

                            {cartItem.length > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e4bf65] px-1 text-xs font-bold text-[#54131c] sm:hidden">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile search */}
            {location.pathname !== "/checkout" && (
                <div
                    className={`container mx-auto px-3 pb-2 lg:hidden ${
                        isSearchPage && isMobile
                            ? "absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                            : ""
                    }`}
                >
                    <SearchBar />
                </div>
            )}

            {/* Login and registration modals */}
            {isLoginOpen &&
                (isRegister ? (
                    <Register
                        setIsLoginOpen={setIsLoginOpen}
                        setIsRegister={setIsRegister}
                    />
                ) : (
                    <Login
                        setIsLoginOpen={setIsLoginOpen}
                        setIsRegister={setIsRegister}
                    />
                ))}
        </header>
    );
}

export default Header;
