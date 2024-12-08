# Fly on the Wall 🎯

Fly on the Wall is an AI-powered tool that transforms meeting transcripts into actionable summaries, highlights, and team insights. Stay informed effortlessly with tailored overviews and dynamic feedback for improved collaboration.

## Features

- 🚀 Built with Next.js 15 and React 19
- 💅 Modern UI with Tailwind CSS and Shadcn components
- 📝 TypeScript support
- 🎨 Responsive and accessible design

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/tanmaypathak/flyonthewall.git
cd flyonthewall
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .example.env .env
```
Edit the `.env` file with your configuration values.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Form Validation**: Zod
- **Development Tools**: ESLint, PostCSS

## Project Structure

```
├── app/               # Next.js app directory
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and libraries
├── public/            # Static assets
├── server-actions/    # Server-side actions
└── styles/            # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
