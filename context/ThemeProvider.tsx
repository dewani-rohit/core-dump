"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface ThemeContextType {
	mode: string;
	setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState("");

	useEffect(() => {
		const handleThemeChange = () => {
			if (mode === "dark") {
				setMode("light");
				document.documentElement.classList.add("light");
			} else {
				setMode("dark");
				document.documentElement.classList.add("light");
			}
		};

		handleThemeChange();
	}, [mode]);

	return (
		<ThemeContext.Provider value={{ mode, setMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
}
