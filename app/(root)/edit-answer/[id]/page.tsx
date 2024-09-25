import Answer from "@/components/forms/Answer";
import { getAnswerById } from "@/lib/actions/answer.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EditAnswerPage({ params }: ParamsProps) {
	const { userId } = auth();

	if (!userId) return null;

	const result = await getAnswerById({ answerId: params.id });

	if (userId !== result.author.clerkId) redirect("/");

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Edit Answer</h1>

			<div className="mt-9">
				<Answer
					type="edit"
					question={result.content}
					questionId={JSON.stringify(result.question)}
					authorId={JSON.stringify(result.author)}
					answerData={JSON.stringify(result)}
				/>
			</div>
		</>
	);
}
