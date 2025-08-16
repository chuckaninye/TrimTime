import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import UserRegister from "./components/UserRegister";
import UserDashboard from "./components/UserDashboard";
import UserLogin from "./components/UserLogin";
// import BarberRegister from "./components/BarberRegister";
// import BarberLogin from "./components/BarberLogin";

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<main className="container mx-auto px-4 py-8">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/user/register" element={<UserRegister />} />
						<Route path="/user/dashboard" element={<UserDashboard />} />
						{<Route path="/user/login" element={<UserLogin />} />}
						{/* <Route path="/barber/register" element={<BarberRegister />} /> */}
						{/* <Route path="/barber/login" element={<BarberLogin />} /> */}
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
