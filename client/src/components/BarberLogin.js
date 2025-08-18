/**
 * BarberLogin.js
 *
 * Login component for barbers to access their dashboard.
 * Features: email/password authentication, form validation, error handling, navigation.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function BarberLogin() {
	// Form state management
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	/**
	 * Updates form state when input values change
	 * @param {Event} e - Input change event
	 */
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	/**
	 * Handles form submission to authenticate barber
	 * @param {Event} e - Form submission event
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Authenticate barber via API
			const response = await axios.post(
				"http://localhost:8000/api/auth/login-barber",
				formData
			);

			// Store authentication data in localStorage
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("barber", JSON.stringify(response.data.barber));

			// Redirect to barber dashboard
			navigate("/barber/dashboard");
		} catch (err) {
			setError(err.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				{/* ===== LOGO AND HEADER ===== */}
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome Back, Barber!
					</h2>
					<p className="text-gray-600">
						Sign in to manage your appointments and business
					</p>
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{/* ===== LOGIN FORM ===== */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your email"
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleChange}
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your password"
								/>
							</div>
						</div>

						{/* Error Display */}
						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
								{error}
							</div>
						)}

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
							>
								{loading ? "Signing in..." : "Sign In"}
							</button>
						</div>
					</form>

					{/* ===== REGISTRATION LINK ===== */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/barber/register"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Register here
							</Link>
						</p>
					</div>

					{/* ===== BACK TO HOME ===== */}
					<div className="mt-4 text-center">
						<Link to="/" className="text-sm text-gray-500 hover:text-gray-400">
							← Back to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BarberLogin;
