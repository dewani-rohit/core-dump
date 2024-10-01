"use server";

import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
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
		let newTagsCounter = 0;

		for (const tag of tags) {
			const tagAlreadyExists = await Tag.exists({
				name: { $regex: new RegExp(`^${tag}$`, "i") },
			});

			if (!tagAlreadyExists) newTagsCounter++;

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

		await Interaction.create({
			user: author,
			action: "ask_question",
			question: question._id,
			tags: tagDocuments,
		});

		await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

		if (newTagsCounter > 0) {
			await User.findByIdAndUpdate(author, {
				$inc: { reputation: newTagsCounter * 3 },
			});
		}

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to create question", error);
		throw error;
	}
}

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDatabase();

		const { searchQuery, filter, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof Question> = {};

		if (searchQuery) {
			query.$or = [
				{
					title: { $regex: new RegExp(searchQuery, "i") },
					content: { $regex: new RegExp(searchQuery, "i") },
				},
			];
		}

		let sortOptions = {};

		switch (filter) {
			case "newest":
				sortOptions = { createdAt: -1 };
				break;
			case "frequent":
				sortOptions = { views: -1 };
				break;
			case "unanswered":
				query.answers = { $size: 0 };
				break;
			default:
				break;
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
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalQuestions = await Question.countDocuments(query);

		const isNext = totalQuestions > skipAmount + questions.length;

		return { questions, isNext };
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

		await Interaction.deleteMany({ question: questionId });

		await Tag.updateMany(
			{ questions: questionId },
			{ $pull: { questions: questionId } }
		);

		await User.findByIdAndUpdate(question.author, {
			$inc: { reputation: -5 },
		});

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
