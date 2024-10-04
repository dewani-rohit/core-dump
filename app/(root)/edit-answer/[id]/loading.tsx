import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
	return (
		<section>
			<h1 className="h1-bold text-dark100_light900">Edit Answer</h1>

			<div className="mt-9">
				<h4 className="paragraph-semibold text-dark400_light800">
					Write your answer here
				</h4>
			</div>

			<div className="mt-6 flex w-full flex-col gap-10">
				<Skeleton className="h-[350px]" />

				<div className="flex justify-end">
					<Skeleton className="h-9 w-20" />
				</div>
			</div>
		</section>
	);
};

export default Loading;
