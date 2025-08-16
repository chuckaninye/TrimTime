import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">
				Welcome to TrimTime
			</h1>
			<p className="text-xl text-gray-600 mb-8">
				Find the perfect barber for your hair type and book appointments easily
			</p>

			<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Looking for a Barber?
					</h2>
					<p className="text-gray-600 mb-4">
						Find barbers in your area who specialize in your hair type
					</p>
					<Link
						to="/user/register"
						className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
					>
						Get Started
					</Link>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Are you a Barber?
					</h2>
					<p className="text-gray-600 mb-4">
						Join our platform and grow your business
					</p>
					<Link
						to="/barber/register"
						className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
					>
						Join Now
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Home;
