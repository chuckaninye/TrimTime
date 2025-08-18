/**
 * App.js
 *
 * Main React application component with routing configuration.
 * Features: client-side routing, component imports, route definitions, layout structure.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// ===== COMPONENT IMPORTS =====

// Navigation and layout components
import Navbar from "./components/Navbar";

// Page components
import Home from "./components/Home";

// Authentication components
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import BarberRegister from "./components/BarberRegister";
import BarberLogin from "./components/BarberLogin";

// Dashboard components
import UserDashboard from "./components/UserDashboard";
import BarberDashboard from "./components/BarberDashboard";

// Feature components
import BarberSearch from "./components/BarberSearch";

function App() {
	return (
		<Router>
			{/* ===== APPLICATION LAYOUT ===== */}
			<div className="min-h-screen bg-gray-50">
				{/* Navigation bar - appears on all pages */}
				<Navbar />

				{/* Main content area with routing */}
				<main className="container mx-auto px-4 py-8">
					<Routes>
						{/* ===== PUBLIC ROUTES ===== */}

						{/* Landing page */}
						<Route path="/" element={<Home />} />

						{/* ===== USER AUTHENTICATION ROUTES ===== */}

						{/* User registration and login */}
						<Route path="/user/register" element={<UserRegister />} />
						<Route path="/user/login" element={<UserLogin />} />

						{/* ===== BARBER AUTHENTICATION ROUTES ===== */}

						{/* Barber registration and login */}
						<Route path="/barber/register" element={<BarberRegister />} />
						<Route path="/barber/login" element={<BarberLogin />} />

						{/* ===== PROTECTED DASHBOARD ROUTES ===== */}

						{/* User dashboard - requires authentication */}
						<Route path="/user/dashboard" element={<UserDashboard />} />

						{/* Barber dashboard - requires authentication */}
						<Route path="/barber/dashboard" element={<BarberDashboard />} />

						{/* ===== FEATURE ROUTES ===== */}

						{/* Barber search - public access */}
						<Route path="/search-barbers" element={<BarberSearch />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
