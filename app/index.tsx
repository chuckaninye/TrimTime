import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Welcome = () => {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/images/logo.png")}
				style={styles.logo}
				resizeMode="cover"
			/>

			<Image
				source={require("../assets/images/barber.png")}
				style={styles.barberImage}
			/>

			<Text style={styles.title}>
				Find the best barbers and stylists near you.
			</Text>
			<Text style={styles.subtitle}>
				Book appointments, browse portfolios, and stay on time.
			</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push("/Login")}
			>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, styles.signupButton]}
				onPress={() => router.push("/Signup")}
			>
				<Text style={styles.buttonText}>Sign up</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Welcome;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "#f8f8f8",
		padding: 20,
	},
	logo: {
		width: 450,
		height: 100,
		marginBottom: 50,
	},
	barberImage: {
		width: "100%",
		height: 200,
		resizeMode: "cover",
		marginBottom: 20,
		borderRadius: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
		marginBottom: 100,
	},
	button: {
		backgroundColor: "#333",
		paddingVertical: 15,
		paddingHorizontal: 50,
		borderRadius: 5,
		marginBottom: 10,
		width: "80%",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	signupButton: {
		backgroundColor: "#555",
	},
});
