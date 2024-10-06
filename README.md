# CoreDump

**CoreDump** is a platform where developers can ask questions, share knowledge, and engage in technical discussions. Whether you're debugging code, seeking advice on best practices, or exploring new technologies, CoreDump connects you with a community of experts ready to help. Join now to collaborate, learn, and grow in your programming journey.

## Table of Contents

- [Live Demo](#live-demo)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Live Demo

Check out the live application here: [CoreDump](https://core-dump.vercel.app/)

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository**:

```bash
git clone https://github.com/dewani-rohit/core-dump.git
cd core-dump
```

2. **Install dependencies**:

```bash
   npm install
```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

NEXT_PUBLIC_TINY_EDITOR_API_KEY=

MONGODB_URL=

WEBHOOK_SECRET=
```

4. **Run the development server**:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

- Start the development server with `npm run dev`.
- Build for production with `npm run build`.
- Run ESLint checks with `npm run lint`.

## Features

CoreDump is packed with features that help developers engage with technical content and community discussions effectively:

- **Next.js Server Actions**: CoreDump utilizes Next.js Server Actions for enhanced performance by handling server-side operations efficiently. This results in faster load times and more responsive user interactions.

- **Question and Answer System**: Users can view a variety of questions posted by others. Only logged-in users have the ability to ask new questions, submit answers, bookmark content, and upvote/downvote posts. This promotes engagement and fosters a collaborative environment while ensuring the quality of contributions.

- **User Reputation and Badges**: Users earn reputation points and badges by participating in activities such as posting questions, answering questions, and receiving upvotes from the community. This encourages meaningful contributions and recognizes active members.

- **Advanced Search and Filtering**: The platform features a global search bar that allows users to search across all content, including questions, answers, and tags. Individual pages also support filtering to help users find exactly what they need quickly. Pagination is also built-in for seamless navigation through large amounts of data.

- **Light and Dark Mode**: Users can switch between light and dark themes, allowing them to customize the user interface based on their preferences or environmental lighting conditions.

## Technologies Used

- **Next.js 14** — React framework for server-side rendering and static site generation
- **TypeScript** — Strongly-typed JavaScript
- **TailwindCSS** — Utility-first CSS framework
- **MongoDB & Mongoose** — NoSQL database and ODM for data modeling
- **Clerk** — Authentication and user management
- **Shadcn UI** — UI components and library
- **ESLint & Prettier** — Code quality and formatting
- **Prism.js** — Syntax highlighting for code blocks
- **Zod** — Schema validation for TypeScript
- **React Hook Form** — Form handling in React
- **Vercel** — Deployment and hosting

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## References

- JSMastery. (2023). [_Ultimate Next.js 14 Course | Become a top 1% Next.js 14 developer_](https://www.jsmastery.pro/ultimate-next-course). E-Learning.
