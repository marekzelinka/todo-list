# Taskgun

This project is a simple, but feature-rich personal todo app.

It's written in [TypeScript](https://www.typescriptlang.org/) and uses [React](https://react.dev/), a JavaScript UI library, [React Router](https://reactrouter.com/), a full-stack framework, [Prisma](https://www.prisma.io/) for database ORM, [shadcn/ui](https://ui.shadcn.com/) for UI components and [Better Auth](https://www.better-auth.com/) for authentication. I'm hosting the live version at [Fly.io](https://fly.io/).

## Get started

1. Clone the repository:

   ```sh
   git clone https://github.com/marekzelinka/taskgun.git
   ```

2. Install the dependencies:

   ```sh
   pnpm i
   ```

3. Define required env variables:

   - Copy the template contents in [.env.example](.env.example) to a new file named `.env` and fill all the required fields.
   - You'll need to [follow this guide](https://www.better-auth.com/docs/installation) to set the following credentials: `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.

4. Finally, run the app in dev mode by running:

   ```sh
   pnpm dev
   ```

## Goals

The goal of this project is to improve of a project I've built while following this Remix Todo App 6-part tutorial by Udoh. I wanted to improve this app by adding support for filtering tasks by due dates and user-created projects.

## Credits

- App idea from [remix-todo-app](https://remix-todo-app-jrhk.onrender.com/), [source code](https://github.com/udohjeremiah/remix-todo-app).
- Feature inspiration from [Todoist](https://app.todoist.com/app/)[Jim Nielsen]..
