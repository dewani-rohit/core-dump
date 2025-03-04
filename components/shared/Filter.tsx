"use client";

import { formUrlQuery } from "@/lib/utils";
import { FilterProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface ComponentFilterProps {
	filters: FilterProps[];
	otherClasses?: string;
	containerClasses?: string;
	jobFilter?: boolean;
}

const Filter = ({
	filters,
	otherClasses,
	containerClasses,
	jobFilter = false,
}: ComponentFilterProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const searchParamKey = jobFilter ? "location" : "filter";
	const paramFilter = searchParams.get(searchParamKey);

	const handleUpdateParams = (value: string) => {
		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: searchParamKey,
			value: jobFilter ? value.toLowerCase() : value,
		});

		router.push(newUrl, { scroll: false });
	};

	return (
		<div className={`relative ${containerClasses}`}>
			<Select
				onValueChange={handleUpdateParams}
				defaultValue={paramFilter || undefined}
			>
				<SelectTrigger
					className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
				>
					<div className="line-clamp-1 flex-1 text-left">
						<SelectValue placeholder="Select filter" />
					</div>
				</SelectTrigger>

				<SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
					<SelectGroup>
						{filters.map((filter) => (
							<SelectItem
								key={filter.value}
								value={filter.value}
								className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
							>
								{filter.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default Filter;
