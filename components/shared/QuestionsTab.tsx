import { UserId } from "@/lib/actions/shared.types";
import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface QuestionsTabProps extends UserId, SearchParamsProps {
	clerkId?: string | null;
}

const QuestionsTab = async ({
	userId,
	clerkId,
	searchParams,
}: QuestionsTabProps) => {
	const { questions, isNext } = await getUserQuestions({
		userId,
		page: searchParams.page ? +searchParams.page : 1,
	});

	return (
		<>
			{questions.map((question) => (
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
			))}

			<div className="mt-10">
				<Pagination
					pageNumber={1}
					isNext={isNext}
				/>
			</div>
		</>
	);
};

export default QuestionsTab;
