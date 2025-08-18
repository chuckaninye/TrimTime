/**
 * BarberDashboard.js
 *
 * Main dashboard for barbers to manage appointments, view profile, and track business metrics.
 * Features: appointment management, status updates, business statistics, tabbed interface.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BarberDashboard() {
	// State management for dashboard data and UI
	const [barber, setBarber] = useState(null);
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("profile");
	const navigate = useNavigate();

	// Initialize dashboard on component mount
	useEffect(() => {
		const barberData = localStorage.getItem("barber");
		if (!barberData) {
			navigate("/barber/login");
			return;
		}

		const barberObj = JSON.parse(barberData);
		setBarber(barberObj);
		fetchBarberAppointments(barberObj.id);
	}, [navigate]);

	/**
	 * Fetches all appointments for the logged-in barber from the backend
	 * @param {string} barberId - The barber's unique identifier
	 */
	const fetchBarberAppointments = async (barberId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/appointments/barber/${barberId}`
			);
			setAppointments(response.data);
		} catch (err) {
			setError("Failed to fetch appointments");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles appointment status changes (confirm, complete, cancel)
	 * @param {string} appointmentId - The appointment's unique identifier
	 * @param {string} action - The action to perform (confirm, complete, cancel)
	 */
	const handleAppointmentAction = async (appointmentId, action) => {
		try {
			let newStatus;
			switch (action) {
				case "confirm":
					newStatus = "confirmed";
					break;
				case "complete":
					newStatus = "completed";
					break;
				case "cancel":
					newStatus = "cancelled";
					break;
				default:
					return;
			}

			await axios.put(
				`http://localhost:8000/api/appointments/${appointmentId}`,
				{
					status: newStatus,
				}
			);

			// Refresh appointments to show updated status
			fetchBarberAppointments(barber.id);
		} catch (err) {
			setError(`Failed to ${action} appointment`);
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
				return "bg-yellow-100 text-yellow-800";
			case "confirmed":
				return "bg-blue-100 text-blue-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "completed":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	/**
	 * Handles user logout by clearing localStorage and redirecting to home
	 */
	const handleLogout = () => {
		localStorage.removeItem("barber");
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
	if (!barber) {
		return null;
	}

	// Filter appointments by status for better organization
	const upcomingAppointments = appointments.filter(
		(apt) => apt.status === "booked" || apt.status === "confirmed"
	);

	const pastAppointments = appointments.filter(
		(apt) => apt.status === "completed" || apt.status === "cancelled"
	);

	// Calculate earnings based on completed appointments ($25 per appointment)
	const totalEarnings =
		pastAppointments.filter((apt) => apt.status === "completed").length * 25;

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* ===== HEADER SECTION ===== */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						Welcome back, {barber.name}!
					</h1>
					<button
						onClick={handleLogout}
						className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
					>
						Logout
					</button>
				</div>

				{/* ===== BUSINESS STATISTICS CARDS ===== */}
				<div className="grid md:grid-cols-4 gap-6">
					<div className="bg-blue-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-blue-800">
							Total Appointments
						</h3>
						<p className="text-3xl font-bold text-blue-600">
							{appointments.length}
						</p>
					</div>

					<div className="bg-yellow-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-yellow-800">Upcoming</h3>
						<p className="text-3xl font-bold text-yellow-600">
							{upcomingAppointments.length}
						</p>
					</div>

					<div className="bg-green-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-green-800">Completed</h3>
						<p className="text-3xl font-bold text-green-600">
							{
								pastAppointments.filter((apt) => apt.status === "completed")
									.length
							}
						</p>
					</div>

					<div className="bg-purple-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-purple-800">
							Total Earnings
						</h3>
						<p className="text-3xl font-bold text-purple-600">
							${totalEarnings}
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

			{/* ===== TABBED INTERFACE ===== */}
			<div className="bg-white rounded-lg shadow-md mb-6">
				{/* Tab Navigation */}
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						<button
							onClick={() => setActiveTab("profile")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "profile"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Profile
						</button>
						<button
							onClick={() => setActiveTab("appointments")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "appointments"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Appointments
						</button>
						<button
							onClick={() => setActiveTab("availability")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "availability"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Availability
						</button>
					</nav>
				</div>

				{/* Tab Content */}
				<div className="p-6">
					{/* ===== PROFILE TAB ===== */}
					{activeTab === "profile" && (
						<div className="space-y-6">
							<div>
								<h2 className="text-2xl font-bold text-gray-800 mb-4">
									Business Profile
								</h2>
								<div className="grid md:grid-cols-2 gap-6">
									{/* Personal Information */}
									<div>
										<h3 className="text-lg font-semibold text-gray-700 mb-2">
											Personal Info
										</h3>
										<p>
											<strong>Name:</strong> {barber.name}
										</p>
										<p>
											<strong>Email:</strong> {barber.email}
										</p>
										<p>
											<strong>Phone:</strong> {barber.phone || "Not set"}
										</p>
									</div>

									{/* Business Information */}
									<div>
										<h3 className="text-lg font-semibold text-gray-700 mb-2">
											Business Info
										</h3>
										<p>
											<strong>Business Name:</strong> {barber.businessName}
										</p>
										<p>
											<strong>Location:</strong> {barber.location}
										</p>
										<p>
											<strong>Rating:</strong>{" "}
											{barber.rating ? `${barber.rating}/5` : "No ratings yet"}
										</p>
									</div>
								</div>

								{/* Specialties Display */}
								<div className="mt-6">
									<h3 className="text-lg font-semibold text-gray-700 mb-2">
										Specialties
									</h3>
									<div className="flex flex-wrap gap-2">
										{barber.specialties.map((specialty, index) => (
											<span
												key={index}
												className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
											>
												{specialty}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* ===== APPOINTMENTS TAB ===== */}
					{activeTab === "appointments" && (
						<div className="space-y-6">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Appointment Management
							</h2>

							{/* ===== UPCOMING APPOINTMENTS SECTION ===== */}
							<div>
								<h3 className="text-lg font-semibold text-gray-700 mb-3">
									Upcoming Appointments
								</h3>

								{upcomingAppointments.length === 0 ? (
									<p className="text-gray-500 text-center py-8">
										No upcoming appointments.
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
														<h4 className="font-semibold text-lg text-gray-800">
															{appointment.user.name}
														</h4>
														<p className="text-gray-600">
															{appointment.user.email}
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

														{/* Action Buttons Based on Status */}
														<div className="flex space-x-2">
															{/* Show Confirm/Cancel for booked appointments */}
															{appointment.status === "booked" && (
																<>
																	<button
																		onClick={() =>
																			handleAppointmentAction(
																				appointment.id,
																				"confirm"
																			)
																		}
																		className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
																	>
																		Confirm
																	</button>
																	<button
																		onClick={() =>
																			handleAppointmentAction(
																				appointment.id,
																				"cancel"
																			)
																		}
																		className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
																	>
																		Cancel
																	</button>
																</>
															)}

															{/* Show Complete for confirmed appointments */}
															{appointment.status === "confirmed" && (
																<button
																	onClick={() =>
																		handleAppointmentAction(
																			appointment.id,
																			"complete"
																		)
																	}
																	className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
																>
																	Complete
																</button>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* ===== PAST APPOINTMENTS SECTION ===== */}
							<div>
								<h3 className="text-lg font-semibold text-gray-700 mb-3">
									Appointment History
								</h3>

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
														<h4 className="font-semibold text-lg text-gray-800">
															{appointment.user.name}
														</h4>
														<p className="text-gray-600">
															{appointment.user.email}
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

													{/* Status Display Only (No Actions for Past Appointments) */}
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
					)}

					{/* ===== AVAILABILITY TAB ===== */}
					{activeTab === "availability" && (
						<div>
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Availability Management
							</h2>
							<p className="text-gray-600 text-center py-8">
								Availability management coming soon!
								<br />
								Barbers will be able to set working hours and block unavailable
								times.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default BarberDashboard;
