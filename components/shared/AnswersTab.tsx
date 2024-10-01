import { UserId } from "@/lib/actions/shared.types";
import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface AnswersTabProps extends UserId, SearchParamsProps {
	clerkId?: string | null;
}

const AnswersTab = async ({
	userId,
	clerkId,
	searchParams,
}: AnswersTabProps) => {
	const { answers, isNext } = await getUserAnswers({
		userId,
		page: searchParams.page ? +searchParams.page : 1,
	});

	return (
		<>
			{answers.map((answer) => (
				<AnswerCard
					key={answer._id}
					_id={answer._id}
					clerkId={clerkId}
					question={answer.question}
					author={answer.author}
					upVotes={answer.upVotes.length}
					createdAt={answer.createdAt}
				/>
			))}

			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={isNext}
				/>
			</div>
		</>
	);
};

export default AnswersTab;
