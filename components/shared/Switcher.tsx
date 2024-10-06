"use client";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface SwitcherProps {
	query: string;
	label: string;
}

const Switcher = ({ query, label }: SwitcherProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const paramFilter = searchParams.get(query);

	const handleUpdateParams = (value: string) => {
		let newUrl;

		if (!value) {
			newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: [query],
			});
		} else {
			newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: query,
				value,
			});
		}

		router.push(newUrl, { scroll: false });
	};

	return (
		<>
			<Switch
				id={`${query}-switcher`}
				className="ml-4 mr-2"
				checked={paramFilter === "true"}
				// @ts-expect-error
				onCheckedChange={handleUpdateParams}
			/>

			<Label
				htmlFor={`${query}-switcher`}
				className="text-light-500"
			>
				{label}
			</Label>
		</>
	);
};

export default Switcher;
