"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
	AnswerVoteParams,
	CreateAnswerParams,
	GetAnswersParams,
} from "./shared.types";

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDatabase();

		const { content, author, question, path } = params;

		const newAnswer = await Answer.create({
			content,
			author,
			question,
		});

		await Question.findByIdAndUpdate(question, {
			$push: { answers: newAnswer._id },
		});

		// TODO create interaction record for user's create answer action

		// TODO author's reputation +5 for creating answer

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to submit answer", error);
		throw error;
	}
}

export async function getAnswers(params: GetAnswersParams) {
	try {
		connectToDatabase();

		const { questionId } = params;

		const answers = await Answer.find({ question: questionId })
			.populate("author", "_id clerkId name picture")
			.sort({ createdAt: -1 });

		return { answers };
	} catch (error) {
		console.log("🔴 Failed to get answers", error);
		throw error;
	}
}

export async function upVoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDatabase();

		const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;

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

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!answer) {
			throw new Error("Answer not found");
		}

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to up vote", error);
		throw error;
	}
}

export async function downVoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDatabase();

		const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;

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

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!answer) {
			throw new Error("Answer not found");
		}

		revalidatePath(path);
	} catch (error) {
		console.log("🔴 Failed to down vote", error);
		throw error;
	}
}
