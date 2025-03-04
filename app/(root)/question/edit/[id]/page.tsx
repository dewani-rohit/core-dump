import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EditQuestionPage({ params }: ParamsProps) {
	const { userId } = auth();

	if (!userId) return null;

	const mongoUser = await getUserById({ userId });

	if (!mongoUser?.onboard) redirect("/onboarding");

	const result = await getQuestionById({ questionId: params.id });

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Edit Question</h1>

			<div className="mt-9">
				<Question
					type="edit"
					mongoUserId={JSON.stringify(mongoUser._id)}
					questionDetails={JSON.stringify(result)}
				/>
			</div>
		</>
	);
}
