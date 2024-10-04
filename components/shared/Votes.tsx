"use client";

import { toast } from "@/hooks/use-toast";
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
	downVoteQuestion,
	upVoteQuestion,
} from "@/lib/actions/question.action";
import { UserId, Voting } from "@/lib/actions/shared.types";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { getFormattedNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		viewQuestion({
			questionId: JSON.parse(itemId),
			userId: userId ? JSON.parse(userId) : undefined,
		});
	}, [itemId, userId, pathname, router]);

	const handleVote = async (action: string) => {
		if (!userId)
			return toast({
				title: "Not signed in",
				description: "You need to be signed in to vote ⚠️",
			});

		if (action === "upVote") {
			if (type === "question") {
				await upVoteQuestion({
					questionId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});

				toast({
					title: `${!hasUpVoted ? "Question upvoted" : "Upvote removed"}`,
					variant: "success",
				});
			} else if (type === "answer") {
				await upVoteAnswer({
					answerId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});

				toast({
					title: `${!hasUpVoted ? "Answer upvoted" : "Upvote removed"}`,
					variant: "success",
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

				toast({
					title: `${!hasDownVoted ? "Question downvoted" : "Downvote removed"}`,
					variant: "success",
				});
			} else if (type === "answer") {
				await downVoteAnswer({
					answerId: JSON.parse(itemId),
					userId: JSON.parse(userId),
					hasUpVoted,
					hasDownVoted,
					path: pathname,
				});

				toast({
					title: `${!hasDownVoted ? "Answer downvoted" : "Downvote removed"}`,
					variant: "success",
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

		toast({
			title: `Question ${
				!hasSaved ? "saved to" : "removed from"
			} your collection`,
			variant: "success",
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
