"use client";

import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import {
	downVoteQuestion,
	upVoteQuestion,
} from "@/lib/actions/question.action";
import { UserId, Voting } from "@/lib/actions/shared.types";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { getFormattedNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface VotesProps extends UserId, Voting {
	type: string;
	itemId: string;
	upVotes: number;
	downVotes: number;
	hasSaved?: boolean;
}

const Votes = ({
	type,
	itemId,
	userId,
	upVotes,
	hasUpVoted,
	downVotes,
	hasDownVoted,
	hasSaved,
}: VotesProps) => {
	const pathname = usePathname();

	const handleVote = async (action: string) => {
		if (!userId) return;

		if (action === "upVote") {
			if (type === "question") {
				await upVoteQuestion({
					questionId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});
			} else if (type === "answer") {
				await upVoteAnswer({
					answerId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});
			}
		}

		if (action === "downVote") {
			if (type === "question") {
				await downVoteQuestion({
					questionId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});
			} else if (type === "answer") {
				await downVoteAnswer({
					answerId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});
			}
		}
	};

	const handleSave = async () => {
		await toggleSaveQuestion({
			userId: JSON.parse(userId),
			questionId: JSON.parse(itemId),
			path: pathname,
		});
	};

	return (
		<div className="flex gap-5">
			<div className="flex-center gap-2.5">
				<div className="flex-center gap-1.5">
					<Image
						src={
							hasUpVoted
								? "/assets/icons/upvoted.svg"
								: "/assets/icons/upvote.svg"
						}
						alt="upvote icon"
						width={18}
						height={18}
						onClick={() => handleVote("upVote")}
						className="cursor-pointer"
					/>

					<div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
						<p className="subtle-medium text-dark400_light900">
							{getFormattedNumber(upVotes)}
						</p>
					</div>
				</div>

				<div className="flex-center gap-1.5">
					<Image
						src={
							hasDownVoted
								? "/assets/icons/downvoted.svg"
								: "/assets/icons/downvote.svg"
						}
						alt="downvote icon"
						width={18}
						height={18}
						onClick={() => handleVote("downVote")}
						className="cursor-pointer"
					/>

					<div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
						<p className="subtle-medium text-dark400_light900">
							{getFormattedNumber(downVotes)}
						</p>
					</div>
				</div>
			</div>

			{type === "question" && (
				<Image
					src={
						hasSaved
							? "/assets/icons/star-filled.svg"
							: "/assets/icons/star-red.svg"
					}
					alt="star icon"
					width={18}
					height={18}
					onClick={handleSave}
					className="cursor-pointer"
				/>
			)}
		</div>
	);
};

export default Votes;
