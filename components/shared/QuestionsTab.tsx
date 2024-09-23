import { UserId } from "@/lib/actions/shared.types";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";

interface QuestionsTabProps extends UserId {
	clerkId?: string | null;
}

const QuestionsTab = async ({ userId, clerkId }: QuestionsTabProps) => {
	const { questions } = await getUserQuestions({ userId });

	return (
		<>
			{questions.map((question) => (
				<QuestionCard
					key={question._id}
					_id={question._id}
					title={question.title}
					tags={question.tags}
					author={question.author}
					upVotes={question.upVotes}
					views={question.views}
					answers={question.answers}
					createdAt={question.createdAt}
				/>
			))}
		</>
	);
};

export default QuestionsTab;
