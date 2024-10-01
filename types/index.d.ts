import { BADGE_CRITERIA } from "@/constants";

export interface ThemeOption {
	label: string;
	value: string;
	icon: string;
}

export interface SidebarLink {
	imgURL: string;
	route: string;
	label: string;
}

export interface FilterProps {
	name: string;
	value: string;
}

export interface URLProps {
	params: { id: string };
	searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
	GOLD: number;
	SILVER: number;
	BRONZE: number;
}

export interface ParamsProps {
	params: { id: string };
}

export interface UrlQueryParams {
	params: string;
	key: string;
	value: string | null;
}

export interface RemoveQueryParams {
	params: string;
	keysToRemove: string[];
}

export interface SearchParamsProps {
	searchParams: { [key: string]: string | undefined };
}

export interface BadgeParams {
	criteria: {
		type: keyof typeof BADGE_CRITERIA;
		count: number;
	}[];
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
