/**
 * BarberSearch.js
 *
 * Search component for users to find barbers by location and hair type specialties.
 * Features: smart location search, filtering, results display, appointment booking integration.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

function BarberSearch() {
	// Search form state
	const [searchParams, setSearchParams] = useState({
		location: "",
		hairType: "",
	});

	// Results and UI state
	const [barbers, setBarbers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	/**
	 * Updates search form state when input values change
	 * @param {Event} e - Input change event
	 */
	const handleChange = (e) => {
		setSearchParams({
			...searchParams,
			[e.target.name]: e.target.value,
		});
	};

	/**
	 * Handles search form submission with smart location handling
	 * @param {Event} e - Form submission event
	 */
	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Smart location search: handle both "City, State" and "City" formats
			let searchLocation = searchParams.location;
			if (!searchParams.location.includes(",")) {
				searchLocation = searchParams.location.trim();
			}

			// Search barbers via API
			const response = await axios.get(
				"http://localhost:8000/api/barbers/search",
				{
					params: {
						...searchParams,
						location: searchLocation,
					},
				}
			);

			setBarbers(response.data);
		} catch (err) {
			setError("Failed to search barbers");
			setBarbers([]);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Clears search form and results
	 */
	const clearSearch = () => {
		setSearchParams({ location: "", hairType: "" });
		setBarbers([]);
	};

	return (
		<div className="max-w-6xl mx-auto">
			{/* ===== SEARCH FORM SECTION ===== */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
					Find Your Perfect Barber
				</h1>

				<form onSubmit={handleSearch} className="space-y-4">
					<div className="grid md:grid-cols-2 gap-4">
						{/* Location Input */}
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								Location
							</label>
							<input
								type="text"
								name="location"
								value={searchParams.location}
								onChange={handleChange}
								placeholder="e.g., Woodbridge, VA or just Woodbridge"
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
							/>
							<p className="text-sm text-gray-500 mt-1">
								Enter city name or "City, State" format
							</p>
						</div>

						{/* Hair Type Selection */}
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2">
								Hair Type Specialties
							</label>
							<select
								name="hairType"
								value={searchParams.hairType}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
							>
								<option value="">All Hair Types</option>
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
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center space-x-4">
						<button
							type="submit"
							disabled={loading}
							className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? "Searching..." : "Search Barbers"}
						</button>

						<button
							type="button"
							onClick={clearSearch}
							className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
						>
							Clear Search
						</button>
					</div>
				</form>
			</div>

			{/* ===== ERROR DISPLAY ===== */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{/* ===== SEARCH RESULTS SECTION ===== */}
			<div className="space-y-4">
				{barbers.length > 0 ? (
					<>
						{/* Results Header */}
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							Found {barbers.length} Barber{barbers.length !== 1 ? "s" : ""} in{" "}
							{searchParams.location.split(",")[0].trim()}
						</h2>

						{/* Barber Cards Grid */}
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{barbers.map((barber) => (
								<div
									key={barber.id}
									className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
								>
									{/* Barber Header */}
									<div className="text-center mb-4">
										<h3 className="text-xl font-semibold text-gray-800 mb-2">
											{barber.name}
										</h3>
										<p className="text-gray-600 font-medium">
											{barber.businessName}
										</p>
									</div>

									{/* Barber Details */}
									<div className="space-y-3">
										{/* Location */}
										<div>
											<span className="text-sm font-medium text-gray-500">
												Location:
											</span>
											<p className="text-gray-800">{barber.location}</p>
										</div>

										{/* Specialties */}
										<div>
											<span className="text-sm font-medium text-gray-500">
												Specialties:
											</span>
											<div className="flex flex-wrap gap-2 mt-1">
												{barber.specialties.map((specialty, index) => (
													<span
														key={index}
														className="bg-blue-100 text-blue-800 px-2 py-2 rounded text-xs"
													>
														{specialty}
													</span>
												))}
											</div>
										</div>

										{/* Rating */}
										<div>
											<span className="text-sm font-medium text-gray-500">
												Rating:
											</span>
											<p className="text-gray-800">
												{barber.rating
													? `${barber.rating}/5`
													: "No ratings yet"}
											</p>
										</div>
									</div>

									{/* Action Button */}
									<div className="mt-4 pt-4 border-t border-gray-200">
										<button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
											Book Appointment
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				) : (
					/* Empty State */
					!loading && (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">
								{searchParams.location || searchParams.hairType
									? "No barbers found matching your criteria. Try adjusting your search."
									: "Search for barbers by location or hair type specialties."}
							</p>
						</div>
					)
				)}
			</div>
		</div>
	);
}

export default BarberSearch;
