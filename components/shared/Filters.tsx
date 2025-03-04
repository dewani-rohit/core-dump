"use client";

import { formUrlQuery } from "@/lib/utils";
import { FilterProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import Switcher from "./Switcher";

interface FiltersProps {
	filters: FilterProps[];
	jobFilter?: boolean;
}

const Filters = ({ filters, jobFilter = false }: FiltersProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [active, setActive] = useState("");

	const handleClick = (item: string) => {
		if (active === item) {
			setActive("");

			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "filter",
				value: null,
			});

			router.push(newUrl, { scroll: false });
		} else {
			setActive(item);

			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "filter",
				value: item.toLowerCase(),
			});

			router.push(newUrl, { scroll: false });
		}
	};

	return (
		<div className="mt-10 flex-wrap gap-5 md:flex">
			{filters.map((filter) => (
				<Button
					key={filter.value}
					onClick={() => handleClick(filter.value)}
					className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
						active === filter.value
							? "bg-primary-100 text-primary-500 dark:bg-dark-400 dark:hover:bg-dark-400"
							: "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
					}`}
				>
					{filter.name}
				</Button>
			))}

			{jobFilter && (
				<div className="background-light800_dark300 mt-2 flex items-center rounded-lg px-3 py-2 shadow-none md:mt-0">
					<Switcher
						query="remote"
						label="Remote Only"
					/>
				</div>
			)}
		</div>
	);
};

export default Filters;
