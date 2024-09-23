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
