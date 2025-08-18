/**
 * Navbar.js
 *
 * Navigation component providing site-wide navigation and user state management.
 * Features: responsive navigation, authentication-aware links, mobile menu support.
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
	// State management for navigation
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [barber, setBarber] = useState(null);
	const navigate = useNavigate();

	// Check authentication status on component mount
	useEffect(() => {
		const userData = localStorage.getItem("user");
		const barberData = localStorage.getItem("barber");

		if (userData) {
			setUser(JSON.parse(userData));
		}
		if (barberData) {
			setBarber(JSON.parse(barberData));
		}
	}, []);

	/**
	 * Handles user logout by clearing localStorage and redirecting
	 */
	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("barber");
		localStorage.removeItem("token");
		setUser(null);
		setBarber(null);
		navigate("/");
	};

	/**
	 * Toggles mobile menu visibility
	 */
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav className="bg-blue-800 text-white shadow-lg">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* ===== BRAND/LOGO SECTION ===== */}
					<div className="flex items-center">
						<Link to="/" className="text-xl font-bold hover:text-blue-200">
							TrimTime
						</Link>
					</div>

					{/* ===== DESKTOP NAVIGATION ===== */}
					<div className="hidden md:flex items-center space-x-6">
						{/* Public navigation links */}
						<Link to="/" className="hover:text-blue-200">
							Home
						</Link>

						<Link to="/search-barbers" className="hover:text-blue-200">
							Find Barbers
						</Link>

						{/* ===== AUTHENTICATION LINKS ===== */}

						{/* Show when no user is logged in */}
						{!user && !barber && (
							<>
								<Link to="/user/register" className="hover:text-blue-200">
									User Register
								</Link>
								<Link to="/user/login" className="hover:text-blue-200">
									User Login
								</Link>
								<Link to="/barber/register" className="hover:text-blue-200">
									Barber Register
								</Link>
								<Link to="/barber/login" className="hover:text-blue-200">
									Barber Login
								</Link>
							</>
						)}

						{/* ===== AUTHENTICATED USER LINKS ===== */}

						{/* Show when user is logged in */}
						{user && (
							<>
								<Link to="/user/dashboard" className="hover:text-blue-200">
									Dashboard
								</Link>
								<button onClick={handleLogout} className="hover:text-blue-200">
									Logout
								</button>
							</>
						)}

						{/* Show when barber is logged in */}
						{barber && (
							<>
								<Link to="/barber/dashboard" className="hover:text-blue-200">
									Dashboard
								</Link>
								<button onClick={handleLogout} className="hover:text-blue-200">
									Logout
								</button>
							</>
						)}
					</div>

					{/* ===== MOBILE MENU BUTTON ===== */}
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							className="text-white hover:text-blue-200 focus:outline-none"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* ===== MOBILE NAVIGATION MENU ===== */}
				{isMenuOpen && (
					<div className="md:hidden pb-4">
						<div className="flex flex-col space-y-2">
							{/* Mobile navigation links - same as desktop but vertical */}
							<Link to="/" className="hover:text-blue-200 py-2">
								Home
							</Link>

							<Link to="/search-barbers" className="hover:text-blue-200 py-2">
								Find Barbers
							</Link>

							{/* Authentication links for mobile */}
							{!user && !barber && (
								<>
									<Link
										to="/user/register"
										className="hover:text-blue-200 py-2"
									>
										User Register
									</Link>
									<Link to="/user/login" className="hover:text-blue-200 py-2">
										User Login
									</Link>
									<Link
										to="/barber/register"
										className="hover:text-blue-200 py-2"
									>
										Barber Register
									</Link>
									<Link to="/barber/login" className="hover:text-blue-200 py-2">
										Barber Login
									</Link>
								</>
							)}

							{/* Authenticated user links for mobile */}
							{user && (
								<>
									<Link
										to="/user/dashboard"
										className="hover:text-blue-200 py-2"
									>
										Dashboard
									</Link>
									<button
										onClick={handleLogout}
										className="hover:text-blue-200 py-2 text-left"
									>
										Logout
									</button>
								</>
							)}

							{barber && (
								<>
									<Link
										to="/barber/dashboard"
										className="hover:text-blue-200 py-2"
									>
										Dashboard
									</Link>
									<button
										onClick={handleLogout}
										className="hover:text-blue-200 py-2 text-left"
									>
										Logout
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
