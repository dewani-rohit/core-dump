import { UserId } from "@/lib/actions/shared.types";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";

interface AnswersTabProps extends UserId {
	clerkId?: string | null;
}

const AnswersTab = async ({ userId, clerkId }: AnswersTabProps) => {
	const { answers } = await getUserAnswers({ userId });

	return (
		<>
			{answers.map((answer) => (
				<AnswerCard
					key={answer._id}
					_id={answer._id}
					question={answer.question}
					author={answer.author}
					upVotes={answer.upVotes.length}
					createdAt={answer.createdAt}
				/>
			))}
		</>
	);
};

export default AnswersTab;
