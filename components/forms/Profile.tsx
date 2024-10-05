"use client";

import { toast } from "@/hooks/use-toast";
import { ClerkId } from "@/lib/actions/shared.types";
import { updateUser } from "@/lib/actions/user.action";
import { ProfileValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProfileProps extends ClerkId {
	user: string;
}

const Profile = ({ user, clerkId }: ProfileProps) => {
	// const router = useRouter();
	const pathname = usePathname();
	const parsedUser = JSON.parse(user);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof ProfileValidation>>({
		resolver: zodResolver(ProfileValidation),
		defaultValues: {
			name: parsedUser.name || "",
			username: parsedUser.username || "",
			portfolioWebsite: parsedUser.portfolioWebsite || "",
			location: parsedUser.location || "",
			bio: parsedUser.bio || "",
		},
	});

	async function onSubmit(values: z.infer<typeof ProfileValidation>) {
		setIsSubmitting(true);

		try {
			await updateUser({
				clerkId,
				updateData: {
					name: values.name,
					username: values.username,
					portfolioWebsite: values.portfolioWebsite,
					location: values.location,
					bio: values.bio,
					onboard: true,
				},
				path: pathname,
			});

			// router.back();
		} catch (error) {
			toast({
				title: "Error updating profile",
				variant: "destructive",
			});

			console.log(error);
		} finally {
			setIsSubmitting(false);

			toast({
				title: "Profile updated successfully",
				variant: "success",
			});
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-9 flex w-full flex-col gap-9"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Name <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Your name"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Username <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Your username"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="portfolioWebsite"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Portfolio Link
							</FormLabel>
							<FormControl>
								<Input
									type="url"
									placeholder="Your portfolio url"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Location
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Your location"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Bio
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Tell us about yourself"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="mt-7 flex justify-end">
					<Button
						type="submit"
						className="primary-gradient w-fit text-light-900"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default Profile;
