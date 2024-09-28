"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "../mongoose";
import {
	CreateQuestionParams,
	DeleteQuestionParams,
	EditQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
	QuestionVoteParams,
} from "./shared.types";

export async function createQuestion(params: CreateQuestionParams) {
	try {
		connectToDatabase();

		const { title, content, tags, author, path } = params;

		const question = await Question.create({
			title,
			content,
			author,
		});

		const tagDocuments = [];

		for (const tag of tags) {
			const existingTag = await Tag.findOneAndUpdate(
				{ name: { $regex: new RegExp(`^${tag}$`, "i") } },
				{ $setOnInsert: { name: tag }, $push: { questions: question._id } },
				{ upsert: true, new: true }
			);

			tagDocuments.push(existingTag._id);
		}

		await Question.findByIdAndUpdate(question._id, {
			$push: { tags: { $each: tagDocuments } },
		});

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to create question", error);
		throw error;
	}
}

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDatabase();

		const { searchQuery } = params;

		const query: FilterQuery<typeof Question> = {};

		if (searchQuery) {
			query.$or = [
				{
					title: { $regex: new RegExp(searchQuery, "i") },
					content: { $regex: new RegExp(searchQuery, "i") },
				},
			];
		}

		const questions = await Question.find(query)
			.populate({
				path: "tags",
				model: Tag,
			})
			.populate({
				path: "author",
				model: User,
			})
			.sort({ createdAt: -1 });

		return { questions };
	} catch (error) {
		console.log("🔴 Failed to get questions", error);
		throw error;
	}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
	try {
		connectToDatabase();

		const { questionId } = params;

		const question = await Question.findById(questionId)
			.populate({
				path: "tags",
				model: Tag,
				select: "_id name",
			})
			.populate({
				path: "author",
				model: User,
				select: "_id clerkId name picture",
			});

		return question;
	} catch (error) {
		console.log("🔴 Failed to get question", error);
		throw error;
	}
}

export async function upVoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDatabase();

		const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

		let updateQuery = {};

		if (hasUpVoted) {
			updateQuery = { $pull: { upVotes: userId } };
		} else if (hasDownVoted) {
			updateQuery = {
				$pull: { downVotes: userId },
				$push: { upVotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { upVotes: userId } };
		}

		const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
			new: true,
		});

		if (!question) {
			throw new Error("Question not found");
		}

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to up vote question");
		throw error;
	}
}

export async function downVoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDatabase();

		const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

		let updateQuery = {};

		if (hasDownVoted) {
			updateQuery = { $pull: { downVotes: userId } };
		} else if (hasUpVoted) {
			updateQuery = {
				$pull: { upVotes: userId },
				$push: { downVotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { downVotes: userId } };
		}

		const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
			new: true,
		});

		if (!question) {
			throw new Error("Question not found");
		}

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to down vote", error);
		throw error;
	}
}

export async function editQuestion(params: EditQuestionParams) {
	try {
		connectToDatabase();

		const { questionId, title, content, path } = params;

		const question = await Question.findById(questionId).populate("tags");

		if (!question) throw new Error("Question not found");

		question.title = title;
		question.content = content;

		await question.save();

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to edit question", error);
		throw error;
	}
}

export async function deleteQuestion(params: DeleteQuestionParams) {
	try {
		connectToDatabase();

		const { questionId, path, isQuestionPath = false } = params;

		const question = await Question.findById({ _id: questionId });

		if (!question) throw new Error("Question not found");

		await Question.deleteOne({ _id: questionId });

		await Answer.deleteMany({ question: questionId });

		// TODO delete all interactions related to the question

		await Tag.updateMany(
			{ questions: questionId },
			{ $pull: { questions: questionId } }
		);

		// TODO decrease author's reputation

		if (isQuestionPath) redirect("/");
		else revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to delete question", error);
		throw error;
	}
}

export async function getHotQuestions() {
	try {
		connectToDatabase();

		const hotQuestions = await Question.find({})
			.sort({ views: -1, upVotes: -1 })
			.limit(5);

		return hotQuestions;
	} catch (error) {
		console.log("🔴 Failed to get popular questions", error);
		throw error;
	}
}
