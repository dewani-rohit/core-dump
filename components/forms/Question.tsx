"use client";

import { useTheme } from "@/context/ThemeProvider";
import { toast } from "@/hooks/use-toast";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { QuestionsSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface QuestionProps {
	type: string;
	mongoUserId: string;
	questionDetails?: string;
}

const Question = ({ mongoUserId, type, questionDetails }: QuestionProps) => {
	const editorRef = useRef(null);
	const { mode } = useTheme();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	const parsedQuestionDetails = questionDetails && JSON.parse(questionDetails);

	const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

	const form = useForm<z.infer<typeof QuestionsSchema>>({
		resolver: zodResolver(QuestionsSchema),
		defaultValues: {
			title: parsedQuestionDetails?.title || "",
			explanation: parsedQuestionDetails?.content || "",
			tags: groupedTags || [],
		},
	});

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: any
	) => {
		if (e.key === "Enter" && field.name === "tags") {
			e.preventDefault();

			const tagInput = e.target as HTMLInputElement;
			const tagValue = tagInput.value.trim();

			if (tagValue !== "") {
				if (tagValue.length > 15) {
					return form.setError("tags", {
						type: "required",
						message: "Tag must be less than 15 characters",
					});
				}

				if (!field.value.includes(tagValue as never)) {
					form.setValue("tags", [...field.value, tagValue]);
					tagInput.value = "";
					form.clearErrors("tags");
				}
			} else {
				form.trigger();
			}
		}
	};

	const handleTagRemove = (value: string, field: any) => {
		const newTags = field.value.filter((t: string) => t !== value);

		form.setValue("tags", newTags);
	};

	const onSubmit = async (values: z.infer<typeof QuestionsSchema>) => {
		setIsSubmitting(true);
		try {
			if (type === "edit") {
				await editQuestion({
					questionId: parsedQuestionDetails._id,
					title: values.title,
					content: values.explanation,
					path: pathname,
				});

				router.push(`/question/${parsedQuestionDetails._id}`);
			} else {
				await createQuestion({
					title: values.title,
					content: values.explanation,
					tags: values.tags,
					author: JSON.parse(mongoUserId),
					path: pathname,
				});

				router.push("/");
			}
		} catch (error) {
			toast({
				title: `Error ${type === "edit" ? "editing" : "posting"} question`,
				variant: "destructive",
			});

			console.error(error);
		} finally {
			setIsSubmitting(false);

			toast({
				title: `Question ${type === "edit" ? "edited" : "posted"} successfully`,
				variant: "success",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-10"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Question Title<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Be specific and imagine you&apos;re asking a question to another
								person.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="explanation"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col gap-3">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Detailed explanation of your problem
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Editor
									apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
									onInit={(editor) =>
										// @ts-ignore
										(editorRef.current = editor)
									}
									onBlur={field.onBlur}
									onEditorChange={(content) => field.onChange(content)}
									initialValue={parsedQuestionDetails?.content || ""}
									init={{
										height: 350,
										menubar: false,
										plugins: [
											"advlist",
											"autolink",
											"lists",
											"link",
											"image",
											"charmap",
											"preview",
											"anchor",
											"searchreplace",
											"visualblocks",
											"codesample",
											"fullscreen",
											"insertdatetime",
											"media",
											"table",
										],
										toolbar:
											"undo redo | " +
											"bold italic forecolor | " +
											"codesample | " +
											"alignleft aligncenter alignright alignjustify | " +
											"bullist numlist",
										codesample_languages: [
											{ text: "HTML", value: "html" },
											{ text: "CSS", value: "css" },
											{ text: "JavaScript", value: "javascript" },
											{ text: "SQL", value: "sql" },
											{ text: "ASP.NET", value: "aspnet" },
											{ text: "Bash", value: "bash" },
											{ text: "C", value: "c" },
											{ text: "C++", value: "cpp" },
											{ text: "C#", value: "csharp" },
											{ text: "Dart", value: "dart" },
											{ text: "Go", value: "go" },
											{ text: "Java", value: "java" },
											{ text: "JSON", value: "json" },
											{ text: "JSX", value: "jsx" },
											{ text: "Kotlin", value: "kotlin" },
											{ text: "MongoDB", value: "mongodb" },
											{ text: "Python", value: "python" },
											{ text: "R", value: "r" },
											{ text: "Ruby", value: "ruby" },
											{ text: "Rust", value: "rust" },
											{ text: "Sass", value: "sass" },
											{ text: "Solidity", value: "solidity" },
											{ text: "TypeScript", value: "typescript" },
										],
										content_style:
											"body { font-family:Inter, sans-serif; font-size:16px }",
										skin: mode === "dark" ? "oxide-dark" : "oxide",
										content_css: mode === "dark" ? "dark" : "light",
									}}
								/>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Introduce the problem and expand on what you put in the title.
								Minimum 20 characters.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Tags<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<>
									<Input
										className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
										placeholder="Add tags..."
										onKeyDown={(e) => handleKeyDown(e, field)}
										disabled={type === "edit"}
									/>

									{field.value.length > 0 && (
										<div className="flex-start mt-2.5 gap-2.5">
											{field.value.map((value) => (
												<Badge
													key={value}
													className="subtle-medium background-light800_dark300 text-light400_light500 flex-center gap-2 rounded-md border-none px-4 py-2 capitalize"
												>
													{value}
													{type !== "edit" && (
														<Image
															src="/assets/icons/close.svg"
															alt="close icon"
															width={12}
															height={12}
															className="cursor-pointer object-contain invert-0 dark:invert"
															onClick={() => handleTagRemove(value, field)}
														/>
													)}
												</Badge>
											))}
										</div>
									)}
								</>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Add up to 5 tags to describe what your question is about. You
								need to press enter to add a tag.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="primary-gradient w-fit !text-light-900"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>{type === "edit" ? "Editing..." : "Posting..."}</>
					) : (
						<>{type === "edit" ? "Edit Question" : "Post Question"}</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default Question;
