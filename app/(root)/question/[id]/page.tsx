import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QuestionDetailsPage({
	params,
	searchParams,
}: URLProps) {
	const { userId: clerkId } = auth();

	let mongoUser;

	if (clerkId) {
		mongoUser = await getUserById({ userId: clerkId });
	} else {
		return redirect("/sign-in");
	}

	const result = await getQuestionById({ questionId: params.id });

	if (!result) return null;

	await viewQuestion({
		questionId: params.id,
		userId: mongoUser._id,
	});

	return (
		<>
			<div className="flex-start w-full flex-col">
				<div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
					<Link
						href={`/profile/${result.author.clerkId}`}
						className="flex items-center justify-start gap-1"
					>
						<Image
							src={result.author.picture}
							alt="profile photo"
							width={22}
							height={22}
							className="rounded-full"
						/>

						<p className="paragraph-semibold text-dark300_light700">
							{result.author.name}
						</p>
					</Link>
					<div className="flex justify-end">
						<Votes
							type="question"
							itemId={JSON.stringify(result._id)}
							userId={JSON.stringify(mongoUser._id)}
							upVotes={result.upVotes.length}
							hasUpVoted={result.upVotes.includes(mongoUser._id)}
							downVotes={result.downVotes.length}
							hasDownVoted={result.downVotes.includes(mongoUser._id)}
							hasSaved={mongoUser?.saved.includes(result._id)}
						/>
					</div>
				</div>

				<h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
					{result.title}
				</h2>
			</div>

			<div className="mb-8 mt-5 flex flex-wrap gap-4">
				<Metric
					imgUrl="/assets/icons/clock.svg"
					alt="clock icon"
					value={` asked ${getTimestamp(result.createdAt)}`}
					title=""
					textStyles="small-medium text-dark400_light800"
				/>
				<Metric
					imgUrl="/assets/icons/message.svg"
					alt="message icon"
					value={getFormattedNumber(result.answers.length)}
					title=" Answers"
					textStyles="small-medium text-dark400_light800"
				/>
				<Metric
					imgUrl="/assets/icons/eye.svg"
					alt="eye icon"
					value={getFormattedNumber(result.views)}
					title=" Views"
					textStyles="small-medium text-dark400_light800"
				/>
			</div>

			<ParseHTML data={result.content} />

			<div className="mt-8 flex flex-row items-center justify-between">
				<div className="flex flex-wrap gap-2">
					{result.tags.map((tag: any) => (
						<RenderTag
							key={tag._id}
							_id={tag._id}
							name={tag.name}
						/>
					))}
				</div>

				{/* //TODO delete action */}
			</div>

			<AllAnswers
				questionId={result._id}
				userId={mongoUser._id}
				totalAnswers={result.answers.length}
			/>

			<Answer
				question={result.content}
				questionId={JSON.stringify(result._id)}
				authorId={JSON.stringify(mongoUser._id)}
			/>
		</>
	);
}
