"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	GetAllTagsParams,
	GetQuestionByTagIdParams,
	GetTopInteractedTagsParams,
} from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		connectToDatabase();

		const { userId, limit = 3 } = params;

		const user = await User.findById(userId);

		if (!user) throw new Error("User not found");

		// find interactions for user and group by tags
		const interactions = await Question.aggregate([
			{ $match: { author: userId } },
			{ $unwind: "$tags" },
			{ $group: { _id: "$tags", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: limit },
		]);

		const tags = await Tag.find({
			_id: { $in: interactions.map((i) => i._id) },
		});

		return tags;
	} catch (error) {
		console.log("🔴 Error getting user interacted tags", error);
		throw error;
	}
}

export async function getAllTags(params: GetAllTagsParams) {
	try {
		connectToDatabase();

		const tags = await Tag.find({});

		return { tags };
	} catch (error) {
		console.log("🔴 Error getting tags", error);
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionByTagIdParams) {
	try {
		connectToDatabase();

		const { tagId } = params;

		const tag = await Tag.findOne({ _id: tagId }).populate({
			path: "questions",
			model: Question,
			options: { sort: { createdAt: -1 } },
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id clerkId name picture" },
			],
		});

		if (!tag) throw new Error("Tag not found");

		const questions = tag.questions;

		return { tagTitle: tag.name, questions };
	} catch (error) {
		console.log("🔴 Error getting questions", error);
		throw error;
	}
}
