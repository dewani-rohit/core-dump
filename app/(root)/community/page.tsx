import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";

export default async function CommunityPage() {
	const result = await getAllUsers({});

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">All Users</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					route="/community"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for amazing minds"
					otherClasses="flex-1"
				/>

				<Filter
					filters={UserFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
				/>
			</div>

			<section className="mt-12 flex flex-wrap gap-4">
				{result.users.length > 0 ? (
					result.users.map((user) => (
						<UserCard
							key={user._id}
							user={user}
						/>
					))
				) : (
					<NoResult
						title="No users found"
						description="Be the first to break the silence! 🚀 Sign up to be the first and kickstart the community. Get involved! 💡"
						link="/sign-up"
						linkTitle="Sign Up"
					/>
				)}
			</section>
		</>
	);
}
