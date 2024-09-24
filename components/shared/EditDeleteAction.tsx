"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface EditDeleteActionProps {
	type: string;
	itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleEdit = () => {
		if (type === "question")
			router.push(`/question/edit/${JSON.parse(itemId)}`);
		else if (type === "answer")
			router.push(`/edit-answer/${JSON.parse(itemId)}`);
	};

	const handleDelete = async () => {
		if (type === "question")
			await deleteQuestion({
				questionId: JSON.parse(itemId),
				path: pathname,
				isQuestionPath: pathname === `/question/${JSON.parse(itemId)}`,
			});
		else if (type === "answer")
			await deleteAnswer({
				answerId: JSON.parse(itemId),
				path: pathname,
			});
	};

	return (
		<div className="flex items-center justify-end gap-3 max-sm:w-full">
			<Image
				src="/assets/icons/edit.svg"
				alt="edit icons"
				width={14}
				height={14}
				className="cursor-pointer"
				onClick={handleEdit}
			/>

			<Image
				src="/assets/icons/trash.svg"
				alt="delete icon"
				width={14}
				height={14}
				className="cursor-pointer"
				onClick={handleDelete}
			/>
		</div>
	);
};

export default EditDeleteAction;
