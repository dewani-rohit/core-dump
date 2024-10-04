"use client";

import { useTheme } from "@/context/ThemeProvider";
import { toast } from "@/hooks/use-toast";
import { createAnswer, editAnswer } from "@/lib/actions/answer.action";
import { QuestionId } from "@/lib/actions/shared.types";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";

interface AnswerProps extends QuestionId {
	type?: string;
	question: string;
	authorId: string;
	answerData?: string;
}

const Answer = ({
	type,
	question,
	questionId,
	authorId,
	answerData,
}: AnswerProps) => {
	const editorRef = useRef(null);
	const { mode } = useTheme();
	const pathname = usePathname();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const parsedAnswerData = answerData && JSON.parse(answerData);

	const form = useForm<z.infer<typeof AnswerSchema>>({
		resolver: zodResolver(AnswerSchema),
		defaultValues: {
			answer: parsedAnswerData?.content || "",
		},
	});

	const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
		setIsSubmitting(true);

		try {
			if (type === "edit") {
				await editAnswer({
					answerId: parsedAnswerData._id,
					content: values.answer,
					path: `/question/${JSON.parse(questionId)}/#${JSON.stringify(
						parsedAnswerData._id
					)}`,
				});
			} else {
				await createAnswer({
					content: values.answer,
					author: JSON.parse(authorId),
					question: JSON.parse(questionId),
					path: pathname,
				});
			}

			form.reset();

			if (editorRef.current) {
				const editor = editorRef.current as any;
				console.log(editorRef.current);

				editor.setContent("");
			}
		} catch (error) {
			toast({
				title: `Error ${type === "edit" ? "editing" : "submitting"} answer`,
				variant: "destructive",
			});

			console.error(error);
			throw error;
		} finally {
			setIsSubmitting(false);

			toast({
				title: `Answer ${
					type === "edit" ? "edited" : "submitted"
				} successfully`,
				variant: "success",
			});
		}
	};

	return (
		<>
			<div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">
					Write your answer here
				</h4>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleCreateAnswer)}
					className="mt-6 flex w-full flex-col gap-10"
				>
					<FormField
						control={form.control}
						name="answer"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormControl className="mt-3.5">
									<Editor
										apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
										onInit={(evt, editor) => {
											// @ts-ignore
											editorRef.current = editor;
										}}
										onBlur={field.onBlur}
										onEditorChange={(content) => field.onChange(content)}
										initialValue={parsedAnswerData?.content || ""}
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
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>

					<div className="flex justify-end">
						<Button
							type="submit"
							className="primary-gradient w-fit text-white"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>{type === "edit" ? "Editing..." : "Submitting..."}</>
							) : (
								<>{type === "edit" ? "Edit" : "Submit"}</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};

export default Answer;
