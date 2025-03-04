import { getFormattedNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";
import Image from "next/image";

interface StatsProps {
	totalQuestions: number;
	totalAnswers: number;
	badges: BadgeCounts;
	reputation: number;
}

interface StatsCardProps {
	imgUrl: string;
	value: number;
	title: string;
}

const StatsCard = ({ imgUrl, title, value }: StatsCardProps) => {
	return (
		<div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
			<Image
				src={imgUrl}
				alt={title}
				width={40}
				height={50}
			/>
			<div>
				<p className="paragraph-semibold text-dark200_light900">{value}</p>
				<p className="body-medium text-dark400_light700">{title}</p>
			</div>
		</div>
	);
};

const Stats = ({
	totalAnswers,
	totalQuestions,
	badges,
	reputation,
}: StatsProps) => {
	return (
		<div className="mt-10">
			<h3 className="h3-semibold text-dark200_light900">Stats</h3>

			<p className="text-light400_light500">Reputation - {reputation}</p>

			<div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
				<div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
					<div className="">
						<p className="paragraph-semibold text-dark200_light900">
							{getFormattedNumber(totalQuestions)}
						</p>

						<p className="body-medium text-dark400_light700">Questions</p>
					</div>

					<div className="">
						<p className="paragraph-semibold text-dark200_light900">
							{getFormattedNumber(totalAnswers)}
						</p>

						<p className="body-medium text-dark400_light700">Answers</p>
					</div>
				</div>

				<StatsCard
					imgUrl="/assets/icons/gold-medal.svg"
					value={badges.GOLD}
					title="Gold Badges"
				/>

				<StatsCard
					imgUrl="/assets/icons/silver-medal.svg"
					value={badges.SILVER}
					title="Silver Badges"
				/>

				<StatsCard
					imgUrl="/assets/icons/bronze-medal.svg"
					value={badges.BRONZE}
					title="Bronze Badges"
				/>
			</div>
		</div>
	);
};

export default Stats;
