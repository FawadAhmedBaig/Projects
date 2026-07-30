# Keep Notes

A beautiful, full-stack note-taking application inspired by Google Keep. 

## Features

- **Notes Management:** Create, read, update, and delete notes.
- **Organization:** 
  - Add custom labels to organize your notes.
  - Archive notes to keep your main workspace clean.
  - Trash for soft-deleted notes with easy recovery.
- **Rich User Interface:** Modern, responsive design with beautiful components and animations.
- **Dark/Light Mode:** Full theme support for a comfortable viewing experience day or night.
- **Authentication:** Secure user authentication using NextAuth.js.
- **Real-time Updates:** Stay synced across devices using Pusher.
- **File Uploads:** Upload attachments and images via UploadThing.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) / shadcn/ui
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Real-time:** [Pusher](https://pusher.com/)
- **File Storage:** [UploadThing](https://uploadthing.com/)
- **State Management & Fetching:** [React Query](https://tanstack.com/query/latest)
- **Deployment & Analytics:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB Database (Atlas or local)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd KeepNotes
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` or `.env.local` file in the root of the project and add the necessary environment variables for:
   - MongoDB URI
   - NextAuth Secret & Providers
   - Pusher Credentials
   - UploadThing Credentials

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages, layouts, and API routes.
- `components/`: Reusable React components (UI elements, layout components, etc.).
- `lib/`: Utility functions and configuration files.
- `hooks/`: Custom React hooks.
- `types/`: TypeScript type definitions.
- `styles/`: Global stylesheets and Tailwind configurations.
- `public/`: Static assets like icons and images.

## License

This project is open-source and available under the [MIT License](LICENSE).
