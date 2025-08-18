/**
 * BarberRegister.js
 *
 * Registration component for new barbers to create accounts.
 * Features: form validation, business information collection, specialty selection, API integration.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function BarberRegister() {
	// Form state management
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		businessName: "",
		location: "",
		specialties: [],
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Available hair type specialties for selection
	const availableSpecialties = [
		{ value: "4a", label: "4a (Coily)" },
		{ value: "4b", label: "4b (Coily)" },
		{ value: "4c", label: "4c (Coily)" },
		{ value: "3a", label: "3a (Curly)" },
		{ value: "3b", label: "3b (Curly)" },
		{ value: "3c", label: "3c (Curly)" },
		{ value: "2a", label: "2a (Wavy)" },
		{ value: "2b", label: "2b (Wavy)" },
		{ value: "2c", label: "2c (Wavy)" },
		{ value: "1a", label: "1a (Straight)" },
		{ value: "1b", label: "1b (Straight)" },
		{ value: "1c", label: "1c (Straight)" },
	];

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
	 * Handles specialty checkbox changes
	 * @param {string} specialty - The specialty value to toggle
	 */
	const handleSpecialtyChange = (specialty) => {
		setFormData((prev) => ({
			...prev,
			specialties: prev.specialties.includes(specialty)
				? prev.specialties.filter((s) => s !== specialty)
				: [...prev.specialties, specialty],
		}));
	};

	/**
	 * Handles form submission to create new barber account
	 * @param {Event} e - Form submission event
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Validate required fields
			if (formData.specialties.length === 0) {
				setError("Please select at least one specialty");
				setLoading(false);
				return;
			}

			// Create barber account via API
			const response = await axios.post(
				"http://localhost:8000/api/auth/register-barber",
				formData
			);

			// Store authentication data in localStorage
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("barber", JSON.stringify(response.data.barber));

			// Redirect to barber dashboard
			navigate("/barber/dashboard");
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
						Join TrimTime as a Barber
					</h2>
					<p className="text-gray-600">
						Create your account and start growing your business
					</p>
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{/* ===== REGISTRATION FORM ===== */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Personal Information Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900">
								Personal Information
							</h3>

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

							{/* Phone Field */}
							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-gray-700"
								>
									Phone Number
								</label>
								<input
									id="phone"
									name="phone"
									type="tel"
									value={formData.phone}
									onChange={handleChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your phone number"
								/>
							</div>
						</div>

						{/* Business Information Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900">
								Business Information
							</h3>

							{/* Business Name Field */}
							<div>
								<label
									htmlFor="businessName"
									className="block text-sm font-medium text-gray-700"
								>
									Business Name
								</label>
								<input
									id="businessName"
									name="businessName"
									type="text"
									required
									value={formData.businessName}
									onChange={handleChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your business name"
								/>
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
									required
									value={formData.location}
									onChange={handleChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="City, State (e.g., Brooklyn, NY)"
								/>
							</div>
						</div>

						{/* Specialties Section */}
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-3">
								Hair Type Specialties
							</h3>
							<p className="text-sm text-gray-600 mb-3">
								Select the hair types you specialize in:
							</p>
							<div className="grid grid-cols-2 gap-3">
								{availableSpecialties.map((specialty) => (
									<label
										key={specialty.value}
										className="flex items-center space-x-2"
									>
										<input
											type="checkbox"
											checked={formData.specialties.includes(specialty.value)}
											onChange={() => handleSpecialtyChange(specialty.value)}
											className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<span className="text-sm text-gray-700">
											{specialty.label}
										</span>
									</label>
								))}
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
								{loading ? "Creating Account..." : "Create Account"}
							</button>
						</div>
					</form>

					{/* ===== LOGIN LINK ===== */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/barber/login"
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

export default BarberRegister;
