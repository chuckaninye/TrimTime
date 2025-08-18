/**
 * UserRegister.js
 *
 * Registration component for new users to create accounts.
 * Features: form validation, hair type selection, location input, API integration.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function UserRegister() {
	// Form state management
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		hairType: "4c",
		location: "",
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
	 * Handles form submission to create new user account
	 * @param {Event} e - Form submission event
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Create user account via API
			const response = await axios.post(
				"http://localhost:8000/api/auth/register",
				formData
			);

			// Store authentication data in localStorage
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.user));

			// Redirect to user dashboard
			navigate("/user/dashboard");
		} catch (err) {
			setError(err.response?.data?.error || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				{/* ===== HEADER ===== */}
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						Join TrimTime
					</h2>
					<p className="text-gray-600">
						Create your account to start booking appointments
					</p>
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{/* ===== REGISTRATION FORM ===== */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700"
							>
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your full name"
							/>
						</div>

						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your email"
							/>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={formData.password}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Create a password"
							/>
						</div>

						{/* Hair Type Selection */}
						<div>
							<label
								htmlFor="hairType"
								className="block text-sm font-medium text-gray-700"
							>
								Hair Type
							</label>
							<select
								id="hairType"
								name="hairType"
								value={formData.hairType}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="4a">4a (Coily)</option>
								<option value="4b">4b (Coily)</option>
								<option value="4c">4c (Coily)</option>
								<option value="3a">3a (Curly)</option>
								<option value="3b">3b (Curly)</option>
								<option value="3c">3c (Curly)</option>
								<option value="2a">2a (Wavy)</option>
								<option value="2b">2b (Wavy)</option>
								<option value="2c">2c (Wavy)</option>
								<option value="1a">1a (Straight)</option>
								<option value="1b">1b (Straight)</option>
								<option value="1c">1c (Straight)</option>
							</select>
						</div>

						{/* Location Field */}
						<div>
							<label
								htmlFor="location"
								className="block text-sm font-medium text-gray-700"
							>
								Location
							</label>
							<input
								id="location"
								name="location"
								type="text"
								value={formData.location}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="City, State (e.g., Brooklyn, NY)"
							/>
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
								{loading ? "Creating Account..." : "Create Account"}
							</button>
						</div>
					</form>

					{/* ===== LOGIN LINK ===== */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/user/login"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign in here
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

export default UserRegister;
