import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserLogin() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await axios.post(
				"http://localhost:8000/api/auth/login",
				formData
			);

			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.user));

			navigate("/user/dashboard");
		} catch (err) {
			setError(err.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
				User Login
			</h2>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Email
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Password
					</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
}

export default UserLogin;
