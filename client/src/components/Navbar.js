import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
	return (
		<nav className="bg-blue-600 text-white shadow-lg">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center py-4">
					<Link to="/" className="text-2xl font-bold">
						TrimTime
					</Link>

					<div className="flex space-x-6">
						<Link to="/user/register" className="hover:text-blue-200">
							Register as User
						</Link>
						<Link to="/user/login" className="hover:text-blue-200">
							User Login
						</Link>
						<Link to="/barber/register" className="hover:text-blue-200">
							Register as Barber
						</Link>
						<Link to="/barber/login" className="hover:text-blue-200">
							Barber Login
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
