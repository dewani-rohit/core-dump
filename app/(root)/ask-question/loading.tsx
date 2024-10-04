import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
	return (
		<section>
			<h1 className="h1-bold text-dark100_light900">Ask a question</h1>

			<div className="mt-9">
				<div className="flex w-full flex-col gap-10">
					<Skeleton className="h-9" />

					<Skeleton className="h-[350px]" />

					<Skeleton className="h-9" />

					<Skeleton className="h-9 w-28" />
				</div>
			</div>
		</section>
	);
};

export default Loading;
