"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetSavedQuestionParams,
	GetUserByIdParams,
	GetUserStatsParams,
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

		const { searchQuery, filter, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof User> = {};

		if (searchQuery) {
			query.$or = [
				{ name: { $regex: new RegExp(searchQuery, "i") } },
				{ username: { $regex: new RegExp(searchQuery, "i") } },
			];
		}

		let sortOptions = {};

		switch (filter) {
			case "new_users":
				sortOptions = { joinedAt: -1 };
				break;
			case "old_users":
				sortOptions = { joinedAt: 1 };
				break;
			case "top_contributors":
				sortOptions = { reputation: -1 };
				break;
			default:
				break;
		}

		const users = await User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalUsers = await User.countDocuments(query);

		const isNext = totalUsers > skipAmount + users.length;

		return { users, isNext };
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

		const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof Question> = {};

		if (searchQuery) {
			query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
		}

		let sortOptions = {};

		switch (filter) {
			case "most_recent":
				sortOptions = { createdAt: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			case "most_voted":
				sortOptions = { upvotes: -1 };
				break;
			case "most_viewed":
				sortOptions = { views: -1 };
				break;
			case "most_answered":
				sortOptions = { answers: -1 };
				break;
			default:
				break;
		}

		const user = await User.findOne({ clerkId }).populate({
			path: "saved",
			match: query,
			options: {
				sort: sortOptions,
				skip: skipAmount,
				limit: pageSize + 1,
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id name clerkId picture" },
			],
		});

		if (!user) throw new Error("User not found");

		const savedQuestions = user.saved;

		const isNext = user.saved.length > pageSize;

		return { questions: savedQuestions, isNext };
	} catch (error) {
		console.log("🔴 Error getting saved questions");
		throw error;
	}
}

export async function getUserInfo(params: GetUserByIdParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });

		if (!user) throw new Error("User not found");

		const totalQuestions = await Question.countDocuments({ author: user._id });
		const totalAnswers = await Answer.countDocuments({ author: user._id });

		return { user, totalQuestions, totalAnswers };
	} catch (error) {
		console.log("🔴 Error getting user information");
		throw error;
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDatabase();

		const { userId, page = 1, pageSize = 10 } = params;

		const totalQuestions = await Question.countDocuments({ author: userId });

		const skipAmount = (page - 1) * pageSize;

		const userQuestions = await Question.find({ author: userId })
			.sort({ views: -1, upVotes: -1 })
			.skip(skipAmount)
			.limit(pageSize)
			.populate("tags", "_id name")
			.populate("author", "_id clerkId name picture");

		const isNext = totalQuestions > skipAmount + userQuestions.length;

		return { totalQuestions, questions: userQuestions, isNext };
	} catch (error) {
		console.log("🔴 Error getting user questions");
		throw error;
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
	try {
		connectToDatabase();

		const { userId, page = 1, pageSize = 10 } = params;

		const totalAnswers = await Answer.countDocuments({ author: userId });

		const skipAmount = (page - 1) * pageSize;

		const userAnswers = await Answer.find({ author: userId })
			.sort({ upVotes: -1 })
			.skip(skipAmount)
			.limit(pageSize)
			.populate("question", "_id title")
			.populate("author", "_id clerkId name picture");

		const isNext = totalAnswers > skipAmount + userAnswers.length;

		return { totalAnswers, answers: userAnswers, isNext };
	} catch (error) {
		console.log("🔴 Error getting user answers");
		throw error;
	}
}
