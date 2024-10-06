import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import {
	getQuestions,
	getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function HomePage({ searchParams }: SearchParamsProps) {
	const { userId: clerkId } = auth();

	const homePageFilters = HomePageFilters.filter(
		(filter) => !(clerkId === null && filter.value === "recommended")
	);

	let result;

	if (searchParams?.filter === "recommended") {
		if (clerkId) {
			result = await getRecommendedQuestions({
				userId: clerkId,
				searchQuery: searchParams.q,
				page: searchParams.page ? +searchParams.page : 1,
			});
		} else {
			result = {
				questions: [],
				isNext: false,
			};
		}
	} else {
		result = await getQuestions({
			searchQuery: searchParams.q,
			filter: searchParams.filter,
			page: searchParams.page ? +searchParams.page : 1,
		});
	}

	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Questions</h1>

				<Link
					href="/ask-question"
					className="flex max-sm:w-full sm:justify-end"
				>
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a Question
					</Button>
				</Link>
			</div>
			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>

				<Filter
					filters={homePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
			</div>

			<Filters filters={homePageFilters} />

			<div className="mt-10 flex w-full flex-col gap-6">
				{result.questions.length > 0 ? (
					result.questions.map((question) => (
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
						title="There are no question to show"
						description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
						link="/ask-question"
						linkTitle="Ask a Question"
					/>
				)}
			</div>

			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	);
}
