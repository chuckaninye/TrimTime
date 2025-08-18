/**
 * AppointmentModal.js
 *
 * Modal component for users to book appointments with barbers.
 * Features: date/time selection, service type selection, notes, form validation.
 */

import React, { useState } from "react";
import axios from "axios";

function AppointmentModal({ barber, isOpen, onClose, onSuccess }) {
	// Form state management
	const [formData, setFormData] = useState({
		appointmentDate: "",
		appointmentTime: "",
		serviceType: "Haircut",
		notes: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	/**
	 * Handles form submission to create a new appointment
	 * @param {Event} e - Form submission event
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Get user data from localStorage
			const userData = JSON.parse(localStorage.getItem("user"));
			if (!userData) {
				setError("Please log in to book appointments");
				return;
			}

			// Combine date and time into ISO string
			const appointmentDateTime = new Date(
				`${formData.appointmentDate}T${formData.appointmentTime}:00Z`
			);

			// Create appointment via API
			const response = await axios.post(
				"http://localhost:8000/api/appointments",
				{
					userId: userData.id,
					barberId: barber.id,
					appointmentDate: appointmentDateTime.toISOString(),
					serviceType: formData.serviceType,
					notes: formData.notes,
				}
			);

			// Handle success and close modal
			onSuccess(response.data);
			onClose();
		} catch (err) {
			setError(err.response?.data?.error || "Failed to book appointment");
		} finally {
			setLoading(false);
		}
	};

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

	// Don't render if modal is not open
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
				{/* ===== MODAL HEADER ===== */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-gray-800">
						Book Appointment with {barber.name}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-2xl"
					>
						×
					</button>
				</div>

				{/* ===== APPOINTMENT FORM ===== */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Date Selection */}
					<div>
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Date
						</label>
						<input
							type="date"
							name="appointmentDate"
							value={formData.appointmentDate}
							onChange={handleChange}
							min={new Date().toISOString().split("T")[0]}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
						/>
					</div>

					{/* Time Selection */}
					<div>
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Time
						</label>
						<input
							type="time"
							name="appointmentTime"
							value={formData.appointmentTime}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
						/>
					</div>

					{/* Service Type Selection */}
					<div>
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Service Type
						</label>
						<select
							name="serviceType"
							value={formData.serviceType}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
						>
							<option value="Haircut">Haircut</option>
							<option value="Fade">Fade</option>
							<option value="Line Up">Line Up</option>
							<option value="Beard Trim">Beard Trim</option>
							<option value="Full Service">Full Service</option>
						</select>
					</div>

					{/* Notes Field */}
					<div>
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Notes (Optional)
						</label>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							rows="3"
							placeholder="Any special requests or notes..."
							className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
						/>
					</div>

					{/* Error Display */}
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
							{error}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? "Booking..." : "Book Appointment"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AppointmentModal;
