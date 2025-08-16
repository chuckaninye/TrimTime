import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		} else {
			navigate("/user/login");
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/");
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-3xl font-bold text-gray-800">
						Welcome, {user.name}!
					</h1>
					<button
						onClick={handleLogout}
						className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
					>
						Logout
					</button>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-blue-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-blue-800 mb-2">
							Your Profile
						</h3>
						<p>
							<strong>Email:</strong> {user.email}
						</p>
						<p>
							<strong>Hair Type:</strong> {user.hairType}
						</p>
						<p>
							<strong>Location:</strong> {user.location}
						</p>
					</div>

					<div className="bg-green-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold text-green-800 mb-2">
							Quick Actions
						</h3>
						<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-2">
							Find Barbers
						</button>
						<button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
							Book Appointment
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserDashboard;
