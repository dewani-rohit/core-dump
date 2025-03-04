"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LocalSearchProps {
	route: string;
	iconPosition: string;
	imgSrc: string;
	placeholder: string;
	otherClasses?: string;
}

const LocalSearch = ({
	route,
	iconPosition,
	imgSrc,
	placeholder,
	otherClasses,
}: LocalSearchProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const query = searchParams.get("q");

	const [search, setSearch] = useState(query || "");

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "q",
					value: search,
				});

				router.push(newUrl, { scroll: false });
			} else {
				if (pathname === route) {
					const newUrl = removeKeysFromQuery({
						params: searchParams.toString(),
						keysToRemove: ["q"],
					});

					router.push(newUrl, { scroll: false });
				}
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [search, route, pathname, router, searchParams, query]);

	return (
		<div
			className={`dark:dark-gradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] bg-light-800 px-4 ${otherClasses} ${
				iconPosition === "right" && "flex-row-reverse"
			}`}
		>
			<Image
				src={imgSrc}
				alt="search icon"
				width={24}
				height={24}
				className="cursor-pointer"
			/>

			<Input
				type="text"
				placeholder={placeholder}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
			/>
		</div>
	);
};

export default LocalSearch;
