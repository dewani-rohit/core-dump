import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import {
	OptionalFilter,
	OptionalPage,
	QuestionId,
	UserId,
} from "@/lib/actions/shared.types";
import { getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import EditDeleteAction from "./EditDeleteAction";
import Filter from "./Filter";
import Pagination from "./Pagination";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface AllAnswersProps
	extends QuestionId,
		UserId,
		OptionalPage,
		OptionalFilter {
	totalAnswers: number;
}

const AllAnswers = async ({
	questionId,
	userId,
	totalAnswers,
	page,
	filter,
}: AllAnswersProps) => {
	const result = await getAnswers({ questionId, sortBy: filter, page });

	return (
		<div className="mt-11">
			<div className="flex items-center justify-between">
				<h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

				<Filter filters={AnswerFilters} />
			</div>

			<div className="">
				{result.answers.map((answer) => {
					const showActionButtons =
						JSON.stringify(userId) === JSON.stringify(answer.author._id);

					return (
						<article
							key={answer._id}
							className="light-border border-b py-10"
							id={JSON.stringify(answer._id)}
						>
							<div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
								<Link
									href={`/profile/${answer.author.clerkId}`}
									className="flex flex-1 items-start gap-1 sm:items-center"
								>
									<Image
										src={answer.author.picture}
										alt="profile photo"
										width={18}
										height={18}
										className="rounded-full object-cover max-sm:mt-0.5"
									/>

									<div className="flex flex-col sm:flex-row sm:items-center">
										<p className="body-semibold text-dark300_light700">
											{answer.author.name}
										</p>

										<p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
											<span className="max-sm:hidden"> • answered </span>
											{getTimestamp(answer.createdAt)}
										</p>
									</div>
								</Link>

								<div className="flex justify-end">
									<Votes
										type="answer"
										itemId={JSON.stringify(answer._id)}
										userId={JSON.stringify(userId)}
										upVotes={answer.upVotes.length}
										hasUpVoted={answer.upVotes.includes(userId)}
										downVotes={answer.downVotes.length}
										hasDownVoted={answer.downVotes.includes(userId)}
									/>
								</div>
							</div>

							<ParseHTML data={answer.content} />

							<SignedIn>
								{showActionButtons && (
									<EditDeleteAction
										type="answer"
										itemId={JSON.stringify(answer._id)}
										authorId={JSON.stringify(userId)}
									/>
								)}
							</SignedIn>
						</article>
					);
				})}
			</div>

			<div className="mt-10 w-full">
				<Pagination
					pageNumber={page ? +page : 1}
					isNext={result.isNext}
				/>
			</div>
		</div>
	);
};

export default AllAnswers;
