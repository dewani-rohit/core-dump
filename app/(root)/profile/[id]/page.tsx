import AnswersTab from "@/components/shared/AnswersTab";
import QuestionsTab from "@/components/shared/QuestionsTab";
import Stats from "@/components/shared/Stats";
import UserInfo from "@/components/shared/UserInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfo } from "@/lib/actions/user.action";
import { getFormattedJoinedDate } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage({ params, searchParams }: URLProps) {
	const { user, totalAnswers, totalQuestions } = await getUserInfo({
		userId: params.id,
	});

	const { userId: clerkId } = auth();
	return (
		<>
			<div className="flex flex-col-reverse items-start justify-between sm:flex-row">
				<div className="flex flex-col items-start gap-4 lg:flex-row">
					<Image
						src={user.picture}
						alt="profile picture"
						width={140}
						height={140}
						className="rounded-full object-cover"
					/>

					<div className="mt-3">
						<h2 className="h2-bold text-dark100_light900">{user.name}</h2>

						<p className="paragraph-regular text-dark200_light800">
							@{user.username}
						</p>

						<div className="mt-5 flex flex-wrap items-center justify-start gap-5">
							{user.portfolioWebsite && (
								<UserInfo
									imgUrl="/assets/icons/link.svg"
									title="Portfolio"
									href={user.portfolioWebsite}
								/>
							)}

							{user.location && (
								<UserInfo
									imgUrl="/assets/icons/location.svg"
									title={user.location}
								/>
							)}

							<UserInfo
								imgUrl="/assets/icons/calendar.svg"
								title={getFormattedJoinedDate(user.joinedAt)}
							/>
						</div>

						{user.bio && (
							<p className="paragraph-regular text-dark400_light800 mt-8">
								{user.bio}
							</p>
						)}
					</div>
				</div>

				<div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
					<SignedIn>
						{clerkId === user.clerkId && (
							<Link href="/profile/edit">
								<Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
									Edit Profile
								</Button>
							</Link>
						)}
					</SignedIn>
				</div>
			</div>

			<Stats
				totalAnswers={totalAnswers}
				totalQuestions={totalQuestions}
			/>

			<div className="mt-10 flex gap-10">
				<Tabs
					defaultValue="top-posts"
					className="flex-1"
				>
					<TabsList className="background-light800_dark400 min-h-[42px] p-1">
						<TabsTrigger
							value="top-posts"
							className="tab"
						>
							Top Posts
						</TabsTrigger>

						<TabsTrigger
							value="answers"
							className="tab"
						>
							Answers
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="top-posts"
						className="mt-5 flex w-full flex-col gap-6"
					>
						<QuestionsTab
							searchParams={searchParams}
							userId={user._id}
							clerkId={clerkId}
						/>
					</TabsContent>

					<TabsContent
						value="answers"
						className="mt-5 flex w-full flex-col gap-6"
					>
						<AnswersTab
							userId={user._id}
							clerkId={clerkId}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
