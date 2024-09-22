"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetSavedQuestionParams,
	ToggleSaveQuestionParams,
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

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDatabase();

		const users = await User.find({});

		return { users };
	} catch (error) {
		console.log("🔴 Error getting users", error);
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

		const user = await User.findOne({ clerkId });

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

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDatabase();

		const { userId, questionId, path } = params;

		const user = await User.findById(userId);

		if (!user) throw new Error("User not found");

		const isQuestionSaved = user.saved.includes(questionId);

		if (isQuestionSaved) {
			await User.findByIdAndUpdate(
				userId,
				{ $pull: { saved: questionId } },
				{ new: true }
			);
		} else {
			await User.findByIdAndUpdate(
				userId,
				{ $addToSet: { saved: questionId } },
				{ new: true }
			);
		}

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Error saving question");
		throw error;
	}
}

export async function getSavedQuestions(params: GetSavedQuestionParams) {
	try {
		connectToDatabase();

		const { clerkId } = params;

		const user = await User.findOne({ clerkId }).populate({
			path: "saved",
			match: {},
			options: {
				sort: { createdAt: -1 },
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id name clerkId picture" },
			],
		});

		if (!user) throw new Error("User not found");

		const savedQuestions = user.saved;

		return { questions: savedQuestions };
	} catch (error) {
		console.log("🔴 Error getting saved questions");
		throw error;
	}
}
