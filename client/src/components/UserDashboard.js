/**
 * UserDashboard.js
 *
 * Main dashboard for users to view their profile, upcoming appointments, and appointment history.
 * Features: profile display, appointment management, appointment history, logout functionality.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
	// State management for user data and appointments
	const [user, setUser] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Initialize dashboard on component mount
	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (!userData) {
			navigate("/user/login");
			return;
		}

		const userObj = JSON.parse(userData);
		setUser(userObj);
		fetchUserAppointments(userObj.id);
	}, [navigate]);

	/**
	 * Fetches all appointments for the logged-in user from the backend
	 * @param {string} userId - The user's unique identifier
	 */
	const fetchUserAppointments = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/appointments/user/${userId}`
			);
			setAppointments(response.data);
		} catch (err) {
			setError("Failed to fetch appointments");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles appointment cancellation by updating status to 'cancelled'
	 * @param {string} appointmentId - The appointment's unique identifier
	 */
	const handleCancelAppointment = async (appointmentId) => {
		if (!window.confirm("Are you sure you want to cancel this appointment?")) {
			return;
		}

		try {
			await axios.put(
				`http://localhost:8000/api/appointments/${appointmentId}`,
				{
					status: "cancelled",
				}
			);

			// Refresh appointments to show updated status
			fetchUserAppointments(user.id);
		} catch (err) {
			setError("Failed to cancel appointment");
		}
	};

	/**
	 * Formats appointment date for user-friendly display
	 * @param {string} dateString - ISO date string from the database
	 * @returns {string} Formatted date string (e.g., "Monday, January 15, 2025 at 10:00 AM")
	 */
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	/**
	 * Returns appropriate CSS classes for appointment status badges
	 * @param {string} status - The appointment status
	 * @returns {string} Tailwind CSS classes for styling
	 */
	const getStatusColor = (status) => {
		switch (status) {
			case "booked":
				return "bg-blue-100 text-blue-800";
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	/**
	 * Handles user logout by clearing localStorage and redirecting to home
	 */
	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		navigate("/");
	};

	// Loading state while fetching data
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	// Guard clause for unauthenticated users
	if (!user) {
		return null;
	}

	// Filter appointments by status for better organization
	const upcomingAppointments = appointments.filter(
		(apt) => apt.status === "booked" || apt.status === "confirmed"
	);

	const pastAppointments = appointments.filter(
		(apt) => apt.status === "completed" || apt.status === "cancelled"
	);

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* ===== HEADER SECTION ===== */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						Welcome back, {user.name}!
					</h1>
					<button
						onClick={handleLogout}
						className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
					>
						Logout
					</button>
				</div>

				{/* ===== USER STATISTICS ===== */}
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold text-gray-700 mb-2">
							Profile Info
						</h3>
						<p>
							<strong>Email:</strong> {user.email}
						</p>
						<p>
							<strong>Hair Type:</strong> {user.hairType}
						</p>
						<p>
							<strong>Location:</strong> {user.location || "Not set"}
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold text-gray-700 mb-2">
							Quick Stats
						</h3>
						<p>
							<strong>Upcoming Appointments:</strong>{" "}
							{upcomingAppointments.length}
						</p>
						<p>
							<strong>Total Appointments:</strong> {appointments.length}
						</p>
					</div>
				</div>
			</div>

			{/* ===== ERROR DISPLAY ===== */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			{/* ===== UPCOMING APPOINTMENTS SECTION ===== */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">
					Upcoming Appointments
				</h2>

				{upcomingAppointments.length === 0 ? (
					<p className="text-gray-500 text-center py-8">
						No upcoming appointments.
						<button
							onClick={() => navigate("/search-barbers")}
							className="text-blue-600 hover:text-blue-800 ml-2 underline"
						>
							Book your first appointment!
						</button>
					</p>
				) : (
					<div className="space-y-4">
						{upcomingAppointments.map((appointment) => (
							<div
								key={appointment.id}
								className="border border-gray-200 rounded-lg p-4"
							>
								<div className="flex justify-between items-start">
									{/* Appointment Details */}
									<div className="flex-1">
										<h3 className="text-xl font-semibold text-gray-800 mb-2">
											{appointment.barber.businessName}
										</h3>
										<p className="text-gray-600 font-medium">
											{appointment.barber.name}
										</p>
										<p className="text-gray-800 font-medium">
											{formatDate(appointment.appointmentDate)}
										</p>
										<p className="text-gray-600">
											Service: {appointment.serviceType}
										</p>
										{appointment.notes && (
											<p className="text-gray-600 text-sm mt-2">
												Notes: {appointment.notes}
											</p>
										)}
									</div>

									{/* Status and Action Buttons */}
									<div className="flex flex-col items-end space-y-2">
										{/* Status Badge */}
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
												appointment.status
											)}`}
										>
											{appointment.status.charAt(0).toUpperCase() +
												appointment.status.slice(1)}
										</span>

										{/* Cancel Button for Active Appointments */}
										<button
											onClick={() => handleCancelAppointment(appointment.id)}
											className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* ===== APPOINTMENT HISTORY SECTION ===== */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">
					Appointment History
				</h2>

				{pastAppointments.length === 0 ? (
					<p className="text-gray-500 text-center py-8">
						No past appointments yet.
					</p>
				) : (
					<div className="space-y-4">
						{pastAppointments.map((appointment) => (
							<div
								key={appointment.id}
								className="border border-gray-200 rounded-lg p-4 bg-gray-50"
							>
								<div className="flex justify-between items-start">
									{/* Appointment Details */}
									<div className="flex-1">
										<h3 className="text-xl font-semibold text-gray-800 mb-2">
											{appointment.barber.businessName}
										</h3>
										<p className="text-gray-600 font-medium">
											{appointment.barber.name}
										</p>
										<p className="text-gray-800 font-medium">
											{formatDate(appointment.appointmentDate)}
										</p>
										<p className="text-gray-600">
											Service: {appointment.serviceType}
										</p>
										{appointment.notes && (
											<p className="text-gray-600 text-sm mt-2">
												Notes: {appointment.notes}
											</p>
										)}
									</div>

									{/* Status Display Only */}
									<div className="flex flex-col items-end">
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
												appointment.status
											)}`}
										>
											{appointment.status.charAt(0).toUpperCase() +
												appointment.status.slice(1)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default UserDashboard;
