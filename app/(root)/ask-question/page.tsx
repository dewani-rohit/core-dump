import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AskQuestionPage() {
	const { userId } = auth();

	if (!userId) redirect("/sign-in");

	const mongoUser = await getUserById({ userId });

	if (!mongoUser?.onboard) redirect("/onboarding");

	return (
		<div className="">
			<h1 className="h1-bold text-dark100_light900">Ask a question</h1>
			<div className="mt-9">
				<Question
					type="create"
					mongoUserId={JSON.stringify(mongoUser._id)}
				/>
			</div>
		</div>
	);
}
