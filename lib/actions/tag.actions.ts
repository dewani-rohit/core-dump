"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
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

		const { page = 1, pageSize = 10, filter, searchQuery } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof Tag> = {};

		if (searchQuery) {
			query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
		}

		let sortOptions = {};

		switch (filter) {
			case "popular":
				sortOptions = { questions: -1 };
				break;
			case "recent":
				sortOptions = { createdAt: -1 };
				break;
			case "name":
				sortOptions = { name: 1 };
				break;
			case "old":
				sortOptions = { createdAt: 1 };
				break;
			default:
				break;
		}

		const tags = await Tag.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalTags = await Tag.countDocuments(query);

		const isNext = totalTags > skipAmount + tags.length;

		return { tags, isNext };
	} catch (error) {
		console.log("🔴 Error getting tags", error);
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionByTagIdParams) {
	try {
		connectToDatabase();

		const { tagId, searchQuery, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };

		const tag = await Tag.findOne(tagFilter).populate({
			path: "questions",
			model: Question,
			match: searchQuery
				? { title: { $regex: searchQuery, $options: "i" } }
				: {},
			options: {
				sort: { createdAt: -1 },
				skip: skipAmount,
				limit: pageSize + 1,
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id clerkId name picture" },
			],
		});

		if (!tag) throw new Error("Tag not found");

		const questions = tag.questions;

		const isNext = tag.questions.length > pageSize;

		return { tagTitle: tag.name, questions, isNext };
	} catch (error) {
		console.log("🔴 Error getting questions", error);
		throw error;
	}
}

export async function getPopularTags() {
	try {
		connectToDatabase();

		const popularTags = await Tag.aggregate([
			{ $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
			{ $sort: { numberOfQuestions: -1 } },
			{ $limit: 5 },
		]);

		return popularTags;
	} catch (error) {
		console.log("🔴 Failed to get popular tags", error);
		throw error;
	}
}
