import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
	return (
		<>
			<h1 className="h1-bold">Home</h1>
			<UserButton afterSwitchSessionUrl="/" />
		</>
	);
}
