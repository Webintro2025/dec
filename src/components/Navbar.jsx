
"use client";
import React, { useState, useEffect } from "react";
import { User, ShoppingBag, Search } from "lucide-react";
import Popup from "./PopUpLogin";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import useDebounce from "@/hooks/useDebounce";

const Navbar = () => {
	const pathname = usePathname();
	const router = useRouter();
	const isHome = pathname === "/";
	const [isScrolled, setIsScrolled] = useState(() => (!isHome ? true : false));
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { openCart, cart } = useCart();
	const iconColorClass = isScrolled ? "text-black" : "text-white";
	const textColorClass = isScrolled ? "text-black" : "text-white";
	const hamburgerLineClass = isScrolled ? "bg-black" : "bg-white";
	const logoSrc = isHome && !isScrolled ? "/whitee.png" : "/black.png";

	useEffect(() => {
		if (!isHome) {
			setIsScrolled(true);
			return undefined;
		}

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 100);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isHome]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("token");
		setIsLoggedIn(Boolean(token));  
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleStorage = (event) => {
			if (event.key === "token") {
				setIsLoggedIn(Boolean(event.newValue));
				if (!event.newValue) {
					setIsPopupOpen(false);
				}
			}
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			setIsPopupOpen(false);
			return undefined;
		}
		const timer = setTimeout(() => {
			setIsPopupOpen(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, [isLoggedIn]);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const handleLoginRequest = () => {
			setIsPopupOpen(true);
		};
		window.addEventListener("app:request-login", handleLoginRequest);
		return () => window.removeEventListener("app:request-login", handleLoginRequest);
	}, []);

	const handleLoginClick = () => {
		if (isLoggedIn) {
			return;
		}
		setIsPopupOpen(true);
	};

	const handleLoginSuccess = () => {
		setIsLoggedIn(true);
		setIsPopupOpen(false);
	};

	const handleLogout = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
			window.dispatchEvent(new CustomEvent("app:token-updated", { detail: "" }));
		}
		setIsLoggedIn(false);
		setIsPopupOpen(false);
	};

	// search state
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedQuery = useDebounce(searchQuery, 300);
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);

	useEffect(() => {
		// Only search when debouncedQuery is at least 2 chars
		if (!debouncedQuery || debouncedQuery.trim().length < 2) {
			setSearchResults([]);
			setSearchLoading(false);
			return;
		}

		let mounted = true;
		setSearchLoading(true);

		(async () => {
			try {
				const res = await fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=10`);
				if (!mounted) return;
				if (res.ok) {
					const json = await res.json();
					setSearchResults(json.products || []);
				} else {
					setSearchResults([]);
				}
			} catch (e) {
				if (!mounted) return;
				setSearchResults([]);
			} finally {
				if (mounted) setSearchLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [debouncedQuery]);

	const handleProductClick = (id) => {
		setSearchOpen(false);
		setSearchQuery("");
		router.push(`/products/${id}`);
	};

	return (
		<>
		<header className={`fixed top-0 left-0 w-full z-50 flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 transition-all duration-300 ${
			isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
		}`}>
			{/* Left: Hamburger (visible on all viewports so desktop shows it too) */}
			<div className="flex flex-1 items-center">
				{!isSidebarOpen && (
					<button
						type="button"
						className="space-y-1 p-2 rounded-md"
						onClick={() => setIsSidebarOpen(true)}
						aria-label="Open menu"
						>
							<span className={`block w-5 h-0.5 transition-colors duration-300 ${hamburgerLineClass}`}></span>
							<span className={`block w-5 h-0.5 transition-colors duration-300 ${hamburgerLineClass}`}></span>
							<span className={`block w-5 h-0.5 transition-colors duration-300 ${hamburgerLineClass}`}></span>
						</button>
					)}
			</div>

			{/* Center: Logo */}
			<div className="flex flex-1 justify-center text-center">
				<Link href="/" aria-label="Go to home">
					<img src={logoSrc} alt="Decor Era" className="mx-auto h-8 sm:h-10 md:h-14 object-contain" />
				</Link>
			</div>

			{/* Right: Icons */}
			<div className={`flex flex-1 items-center justify-end space-x-3 md:space-x-6 transition-colors duration-300 ${textColorClass}`}>
				{/* Search */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setSearchOpen((s) => !s)}
						className="p-2 rounded-md"
						aria-label="Search products"
					>
						<Search className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
					</button>

					{searchOpen && (
						/* Responsive dropdown: full width with side padding on small screens, fixed width on sm+ */
						<div className="absolute mt-2 z-50 right-4 left-4 sm:right-0 sm:left-auto sm:w-80 w-[min(92vw,20rem)] bg-white shadow-lg rounded-md text-black">
							<div className="p-2">
								<input
									autoFocus
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search products..."
									className="w-full border rounded px-3 py-2 text-sm text-black"
								/>
							</div>
							<div className="max-h-[50vh] sm:max-h-64 overflow-auto">
								{searchLoading && <div className="p-3 text-sm text-gray-500">Searching...</div>}
								{!searchLoading && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
									<div className="p-3 text-sm text-gray-500">No results</div>
								)}
								{searchResults.map((p) => (
									<button key={p.id} onClick={() => handleProductClick(p.id)} className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50">
										<img src={p.thumbnail || '/img1.png'} alt={p.name} className="w-12 h-12 object-cover rounded" />
										<div>
											<div className="text-sm font-medium">{p.name}</div>
											<div className="text-xs text-gray-500">{p.category?.name || ''}</div>
										</div>
									</button>
								))}
							</div>
						</div>
					)}
				</div>
				{/* Log in / Log out */}
				{isLoggedIn ? (
					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center space-x-1 p-2 rounded-md"
						title="Log out"
					>
						<User className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
						<span className={`hidden lg:inline text-sm transition-colors duration-300 ${textColorClass}`}>Log out</span>
					</button>
				) : (
					<button
						type="button"
						onClick={handleLoginClick}
						className="flex items-center space-x-1 p-2 rounded-md"
						title="Log in"
					>
						<User className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
						<span className={`hidden lg:inline text-sm transition-colors duration-300 ${textColorClass}`}>Log in</span>
					</button>
				)}
				{/* Cart */}
				<button
					type="button"
					onClick={openCart}
					className="relative flex items-center space-x-1 cursor-pointer"
					aria-label="Open cart"
				>
					<ShoppingBag className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
					<span className={`hidden lg:inline text-sm transition-colors duration-300 ${textColorClass}`}>Cart</span>
					{cart.items.length > 0 && (
						<span className="absolute -right-3 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 px-1 text-[11px] font-semibold text-white">
							{cart.items.reduce((sum, item) => sum + item.quantity, 0)}
						</span>
					)}
				</button>
				
				{/* WhatsApp */}
			
			</div>
		</header>
		<Popup
			isOpen={isPopupOpen}
			onClose={() => setIsPopupOpen(false)}
			onSuccess={handleLoginSuccess}
		/>
		<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
		</>
	);
};

export default Navbar;
