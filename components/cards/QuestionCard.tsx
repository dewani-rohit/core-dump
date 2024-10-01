import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import EditDeleteAction from "../shared/EditDeleteAction";
import Metric from "../shared/Metric";
import RenderTag from "../shared/RenderTag";

interface QuestionProps {
	_id: string;
	title: string;
	tags: { _id: string; name: string }[];
	author: {
		_id: string;
		name: string;
		picture: string;
		clerkId: string;
	};
	upVotes: string[];
	views: number;
	answers: Array<object>;
	createdAt: Date;
	clerkId?: string | null;
}

const QuestionCard = ({
	_id,
	title,
	tags,
	author,
	upVotes,
	views,
	answers,
	createdAt,
	clerkId,
}: QuestionProps) => {
	const showActionButtons = clerkId && clerkId === author.clerkId;

	return (
		<div className="card-wrapper rounded-[10px] p-9 sm:px-11">
			<div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
				<div className="">
					<span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
						{getTimestamp(createdAt)}
					</span>

					<Link href={`/question/${_id}`}>
						<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
							{title}
						</h3>
					</Link>
				</div>

				<SignedIn>
					{showActionButtons && (
						<EditDeleteAction
							type="question"
							itemId={JSON.stringify(_id)}
							authorId={JSON.stringify(author._id)}
						/>
					)}
				</SignedIn>
			</div>

			<div className="mt-3.5 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<RenderTag
						key={tag._id}
						_id={tag._id}
						name={tag.name}
					/>
				))}
			</div>

			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<Metric
					imgUrl={author.picture}
					alt="profile picture"
					value={author.name}
					title={` • asked ${getTimestamp(createdAt)}`}
					href={`/profile/${author._id}`}
					isAuthor
					textStyles="body-medium text-dark400_light700"
				/>

				<div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
					<Metric
						imgUrl="/assets/icons/like.svg"
						alt="like"
						value={getFormattedNumber(upVotes.length)}
						title=" Votes"
						textStyles="small-medium text-dark400_light800"
					/>

					<Metric
						imgUrl="/assets/icons/message.svg"
						alt="message"
						value={getFormattedNumber(answers.length)}
						title=" Answers"
						textStyles="small-medium text-dark400_light800"
					/>

					<Metric
						imgUrl="/assets/icons/eye.svg"
						alt="eye"
						value={getFormattedNumber(views)}
						title=" Views"
						textStyles="small-medium text-dark400_light800"
					/>
				</div>
			</div>
		</div>
	);
};

export default QuestionCard;
