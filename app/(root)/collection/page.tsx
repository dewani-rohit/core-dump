import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function CollectionPage({
	searchParams,
}: SearchParamsProps) {
	const { userId: clerkId } = auth();

	if (!clerkId) return null;

	const result = await getSavedQuestions({
		clerkId,
		searchQuery: searchParams.q,
		filter: searchParams.filter,
	});

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					route="/collection"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>

				<Filter
					filters={QuestionFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
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
						title="No Saved Questions Found"
						description="It appears that there are no saved questions in your collection at the moment 😔. Start exploring and saving questions that pique your interest 🌟"
						link="/"
						linkTitle="Explore Questions"
					/>
				)}
			</div>
		</>
	);
}
