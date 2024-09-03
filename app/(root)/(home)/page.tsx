import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
	{
		_id: "q1",
		title: "How to implement authentication in a React app?",
		tags: [
			{ _id: "tag1", name: "React" },
			{ _id: "tag2", name: "Authentication" },
			{ _id: "tag3", name: "JavaScript" },
		],
		author: {
			_id: "user1",
			name: "Jane Doe",
			picture: "https://randomuser.me/api/portraits/women/1.jpg",
		},
		upVotes: 45,
		views: 1234,
		answers: [
			{
				_id: "a1",
				author: {
					_id: "user2",
					name: "John Smith",
					picture: "https://randomuser.me/api/portraits/men/2.jpg",
				},
				content:
					"You can use Firebase for authentication, or implement it yourself with JWT.",
				upVotes: 30,
				createdAt: new Date("2024-09-01T10:20:30Z"),
			},
		],
		createdAt: new Date("2024-08-30T14:12:00Z"),
	},
	{
		_id: "q2",
		title: "What is the best way to manage state in Angular?",
		tags: [
			{ _id: "tag4", name: "Angular" },
			{ _id: "tag5", name: "State Management" },
			{ _id: "tag6", name: "NgRx" },
		],
		author: {
			_id: "user3",
			name: "Alice Johnson",
			picture: "https://randomuser.me/api/portraits/women/3.jpg",
		},
		upVotes: 70,
		views: 2345,
		answers: [
			{
				_id: "a2",
				author: {
					_id: "user4",
					name: "Bob Brown",
					picture: "https://randomuser.me/api/portraits/men/4.jpg",
				},
				content:
					"NgRx is a popular choice, but you can also use simple services with RxJS.",
				upVotes: 50,
				createdAt: new Date("2023-09-02T09:45:00Z"),
			},
			{
				_id: "a3",
				author: {
					_id: "user5",
					name: "Charlie Davis",
					picture: "https://randomuser.me/api/portraits/men/5.jpg",
				},
				content:
					"It depends on the scale of your application. For small apps, services work fine.",
				upVotes: 20,
				createdAt: new Date("2023-09-02T11:00:00Z"),
			},
		],
		createdAt: new Date("2024-02-21T08:00:00Z"),
	},
	{
		_id: "q3",
		title: "How to optimize a Node.js application for performance?",
		tags: [
			{ _id: "tag7", name: "Node.js" },
			{ _id: "tag8", name: "Performance" },
			{ _id: "tag9", name: "Optimization" },
		],
		author: {
			_id: "user6",
			name: "Eve White",
			picture: "https://randomuser.me/api/portraits/women/6.jpg",
		},
		upVotes: 85,
		views: 3456,
		answers: [
			{
				_id: "a4",
				author: {
					_id: "user7",
					name: "David Green",
					picture: "https://randomuser.me/api/portraits/men/7.jpg",
				},
				content:
					"Consider using clustering, load balancing, and caching strategies.",
				upVotes: 60,
				createdAt: new Date("2023-09-03T13:20:00Z"),
			},
		],
		createdAt: new Date("2024-09-03T12:30:00Z"),
	},
];

export default function HomePage() {
	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Questions</h1>

				<Link
					href="/ask-question"
					className="flex max-sm:w-full sm:justify-end"
				>
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a Question
					</Button>
				</Link>
			</div>
			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>

				<Filter
					filters={HomePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
			</div>

			<HomeFilters />

			<div className="mt-10 flex w-full flex-col gap-6">
				{questions.length > 0 ? (
					questions.map((question) => (
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
					))
				) : (
					<NoResult
						title="There are no question to show"
						description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
						link="/ask-question"
						linkTitle="Ask a Question"
					/>
				)}
			</div>
		</>
	);
}
