import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function TagPage({ params, searchParams }: URLProps) {
	const { userId: clerkId } = auth();
	const result = await getQuestionsByTagId({
		tagId: params.id,
		searchQuery: searchParams.q,
	});

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

			<div className="mt-11 w-full">
				<LocalSearch
					route={`/tags/${params.id}`}
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search tag questions"
					otherClasses="flex-1"
				/>
			</div>

			<div className="mt-10 flex w-full flex-col gap-6">
				{result.questions.length > 0 ? (
					result.questions.map((question: any) => (
						<QuestionCard
							key={question._id}
							_id={question._id}
							clerkId={clerkId}
							title={question.title}
							tags={question.tags}
							author={question.author}
							upVotes={question.upVotes}
							views={question.views}
							answers={question.answers}
							createdAt={question.createdAt}
						/>
					))
				) : (
					<NoResult
						title="No Tag Questions Found"
						description="It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
						link="/"
						linkTitle="Explore Questions"
					/>
				)}
			</div>
		</>
	);
}
