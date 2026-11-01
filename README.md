# DBFY

DBFY is a visual database schema builder. Create projects, design tables on a canvas, connect fields, and generate SQL or Prisma schemas.

## Features

- Build and organize database projects in a protected workspace.
- Create tables and fields on a visual React Flow canvas.
- Define primary keys, unique and nullable constraints, and generated identifiers.
- Connect fields with references and validate schema relationships.
- Preview and copy generated SQL or Prisma schema code.
- Save, rename, and delete projects.
- Sign in and sign up with Clerk using DBFY’s themed authentication pages.

## Requirements

- Node.js 20.9 or newer
- npm
- A MongoDB database
- A Clerk application with the publishable and secret keys

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and add your application keys:

```dotenv
MONGODB_URI=mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Use the connection string for your MongoDB database and the keys from your Clerk application. Keep secret keys private and do not commit environment files.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page is public. Sign in or sign up to access the project workspace at `/playground`.

## Available commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npx tsc --noEmit  # Check TypeScript types
npm run build     # Create a production build
npm start         # Serve the production build
```

The production build uses `next/font` to fetch and self-host the configured Google Fonts. A network connection may be needed during the first build in a fresh environment.

## Project structure

```text
app/
  (app)/playground/       Project workspace
  (app)/p/[id]/           Visual schema editor
  api/                    Authenticated project API handlers
  sign-in/                Themed Clerk sign-in page
  sign-up/                Themed Clerk sign-up page
components/
  playground/             Workspace sections, project cards, and dialogs
  project-editor/         Canvas, schema sidebar, and loading/error UI
  ui/                     Shared form and feedback components
hooks/                    Project loading and mutation workflows
lib/
  api/                    Client-side project API calls
  database/               MongoDB connection
  validation/             Project schema validation
models/                   Mongoose models
store/                    Zustand canvas state
types/                    Shared TypeScript types and reducer actions
```

The project workspace uses a reducer for list and dialog state. The schema editor uses a reducer for editor UI state and Zustand for the interactive canvas graph.
