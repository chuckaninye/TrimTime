/**
 * Home.js
 *
 * Landing page component providing introduction and navigation to key features.
 * Features: welcome message, call-to-action buttons, feature highlights.
 */

import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<div className="max-w-6xl mx-auto">
			{/* ===== HERO SECTION ===== */}
			<div className="text-center py-16">
				<h1 className="text-5xl font-bold text-gray-800 mb-6">
					Welcome to TrimTime
				</h1>
				<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
					Find the perfect barber for your hair type and book appointments with
					ease. Whether you're looking for a fade, line-up, or full service,
					we've got you covered.
				</p>

				{/* ===== CALL-TO-ACTION BUTTONS ===== */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						to="/search-barbers"
						className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
					>
						Find Barbers
					</Link>

					<Link
						to="/user/register"
						className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
					>
						Get Started
					</Link>
				</div>
			</div>

			{/* ===== FEATURE HIGHLIGHTS ===== */}
			<div className="grid md:grid-cols-3 gap-8 py-16">
				{/* Feature 1: Barber Discovery */}
				<div className="text-center p-6">
					<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						Find Your Perfect Barber
					</h3>
					<p className="text-gray-600">
						Search by location and hair type specialties to find barbers who
						understand your needs.
					</p>
				</div>

				{/* Feature 2: Easy Booking */}
				<div className="text-center p-6">
					<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						Book Appointments Instantly
					</h3>
					<p className="text-gray-600">
						Schedule appointments with just a few clicks. No more phone calls or
						waiting in line.
					</p>
				</div>

				{/* Feature 3: Manage Your Schedule */}
				<div className="text-center p-6">
					<div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						Manage Your Schedule
					</h3>
					<p className="text-gray-600">
						Keep track of your appointments, reschedule when needed, and view
						your booking history.
					</p>
				</div>
			</div>

			{/* ===== USER TYPE SELECTION ===== */}
			<div className="bg-gray-50 rounded-lg p-8 text-center">
				<h2 className="text-3xl font-bold text-gray-800 mb-6">
					Ready to Get Started?
				</h2>
				<p className="text-gray-600 mb-8">
					Choose how you'd like to use TrimTime
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					{/* User Registration */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							Looking for a Barber?
						</h3>
						<p className="text-gray-600 mb-4">
							Create an account to book appointments and manage your schedule.
						</p>
						<Link
							to="/user/register"
							className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
						>
							Sign Up as User
						</Link>
					</div>

					{/* Barber Registration */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							Are You a Barber?
						</h3>
						<p className="text-gray-600 mb-4">
							Join our platform to grow your business and manage appointments.
						</p>
						<Link
							to="/barber/register"
							className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
						>
							Sign Up as Barber
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
