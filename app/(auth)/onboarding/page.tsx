import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
	const { userId } = auth();

	if (!userId) return null;

	const mongoUser = await getUserById({ userId });

	if (mongoUser?.onboard) redirect("/");

	return (
		<>
			<main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
				<h1 className="h1-bold text-dark100_light900">Onboarding</h1>

				<p className="base-medium text-dark100_light900 mt-3">
					Complete your profile now to use CoreDump
				</p>

				<div className="background-light850_dark100 mt-9 p-10">
					<Profile
						clerkId={userId}
						user={JSON.stringify(mongoUser)}
					/>
				</div>
			</main>
		</>
	);
}
