import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set("strictQuery", true);

	if (!process.env.MONGODB_URL) return console.log("🔴 Missing mongodb url");

	if (isConnected) return console.log("🟢 Already connected to mongodb");

	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			dbName: "coreDumpDB",
		});

		isConnected = true;

		console.log("🟢 Connected to mongodb");
	} catch (error) {
		console.log("🔴 Failed to connect to mongodb", error);
	}
};
