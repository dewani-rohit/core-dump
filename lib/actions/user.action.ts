"use server";

import Question from "@/database/question.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	UpdateUserParams,
} from "./shared.types";

export async function getUserById(params: any) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });

		return user;
	} catch (error) {
		console.log("🔴 Error while getting user", error);
		throw error;
	}
}

export async function createUser(params: CreateUserParams) {
	try {
		connectToDatabase();

		const newUser = await User.create(params);

		return newUser;
	} catch (error) {
		console.log("🔴 Error while saving user to db", error);
		throw error;
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		connectToDatabase();

		const { clerkId, updateData, path } = params;

		await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Error while updating user", error);
		throw error;
	}
}

export async function deleteUser(params: DeleteUserParams) {
	try {
		connectToDatabase();

		const { clerkId } = params;

		const user = await User.findById({ clerkId });

		if (!user) {
			throw new Error("User not found");
		}

		await Question.deleteMany({ author: user._id });

		// TODO delete user answers, comments, etc

		const deletedUser = await User.findByIdAndDelete(user._id);

		return deletedUser;
	} catch (error) {
		console.log("🔴 Error deleting user", error);
		throw error;
	}
}
