import { ThemeProvider } from "@/context/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
});

const spaceGrotesk = SpaceGrotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
	title: "Core Dump - Crack the Code, Fix the Bugs, Build the Future",
	description:
		"Core Dump is a platform where developers can ask questions, share knowledge, and engage in technical discussions. Whether you're debugging code, seeking advice on best practices, or exploring new technologies, Core Dump connects you with a community of experts ready to help. Join now to collaborate, learn, and grow in your programming journey.",
	icons: {
		icon: "/assets/images/site-logo.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${spaceGrotesk.variable} background-light850_dark100`}
			>
				<ClerkProvider
					appearance={{
						elements: {
							formButtonPrimary: "primary-gradient",
							footerActionLink: "primary-text-gradient hover:text-primary-500",
						},
					}}
				>
					<ThemeProvider>{children}</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
