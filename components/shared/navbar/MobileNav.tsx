"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";

import { sidebarLinks } from "@/constants";

const NavContent = () => {
	const pathname = usePathname();

	return (
		<section className="flex h-full flex-col gap-2 pt-16 sm:gap-4">
			{sidebarLinks.map((link) => {
				const isActive: boolean =
					(pathname.includes(link.route) && link.route.length > 1) ||
					pathname === link.route;

				return (
					<SheetClose
						asChild
						key={link.route}
					>
						<Link
							href={link.route}
							className={`${
								isActive
									? "primary-gradient rounded-lg text-light-900"
									: "text-dark300_light900"
							} flex items-center justify-start gap-4 bg-transparent p-4`}
						>
							<Image
								src={link.imgURL}
								alt={link.label}
								width={20}
								height={20}
								className={`${isActive ? "" : "invert-colors"}`}
							/>
							<p className={`${isActive ? "base-bold" : "base-medium"}`}>
								{link.label}
							</p>
						</Link>
					</SheetClose>
				);
			})}
		</section>
	);
};

const Mobile = () => {
	return (
		<Sheet>
			<SheetTrigger
				asChild
				className="cursor-pointer"
			>
				<Image
					src="/assets/icons/hamburger.svg"
					alt="Menu"
					width={36}
					height={36}
					className="invert-colors sm:hidden"
				/>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="background-light900_dark200 overflow-auto border-none"
			>
				<Link
					href="/"
					className="flex items-center gap-1"
				>
					<Image
						src="/assets/images/site-logo.svg"
						width={23}
						height={23}
						alt="CoreDump"
					/>

					<p className="h2-bold text-dark100_light900 font-spaceGrotesk">
						Core <span className="text-primary-500">Dump</span>
					</p>
				</Link>
				<div>
					<SheetClose asChild>
						<NavContent />
					</SheetClose>

					<SignedOut>
						<div className="flex flex-col gap-3 pt-8">
							<SheetClose asChild>
								<Link href="/sign-in">
									<Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
										<span className="primary-text-gradient">Log In</span>
									</Button>
								</Link>
							</SheetClose>

							<SheetClose asChild>
								<Link href="/sign-up">
									<Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
										Sign Up
									</Button>
								</Link>
							</SheetClose>
						</div>
					</SignedOut>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default Mobile;
