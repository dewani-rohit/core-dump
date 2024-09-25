import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import EditDeleteAction from "../shared/EditDeleteAction";
import Metric from "../shared/Metric";

interface AnswerCardProps {
	_id: string;
	question: {
		_id: string;
		title: string;
	};
	author: {
		_id: string;
		clerkId: string;
		name: string;
		picture: string;
	};
	upVotes: number;
	createdAt: Date;
	clerkId?: string | null;
}

const AnswerCard = ({
	_id,
	question,
	author,
	upVotes,
	createdAt,
	clerkId,
}: AnswerCardProps) => {
	const showActionButtons = clerkId && clerkId === author.clerkId;

	return (
		<Link
			href={`/question/${question._id}/#${JSON.stringify(_id)}`}
			className="card-wrapper rounded-[10px] px-11 py-9"
		>
			<div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
				<div className="">
					<span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
						{getTimestamp(createdAt)}
					</span>

					<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
						{question.title}
					</h3>
				</div>

				<SignedIn>
					{showActionButtons && (
						<EditDeleteAction
							type="answer"
							itemId={JSON.stringify(_id)}
						/>
					)}
				</SignedIn>
			</div>

			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<Metric
					imgUrl={author.picture}
					alt="user avatar"
					value={author.name}
					title={` • asked ${getTimestamp(createdAt)}`}
					href={`/profile/${author.clerkId}`}
					textStyles="body-medium text-dark400_light700"
					isAuthor
				/>

				<div className="flex-center gap-3">
					<Metric
						imgUrl="/assets/icons/like.svg"
						alt="like icon"
						value={getFormattedNumber(upVotes)}
						title=" Votes"
						textStyles="small-medium text-dark400_light800"
					/>
				</div>
			</div>
		</Link>
	);
};

export default AnswerCard;
