# Aara Clothing - Inventory & Order Management System

Internal Inventory & Order Management System for Aara Clothing store.

## Overview

This is an internal web application used by store employees to manage products, inventory, customers, and orders. This is **NOT** an e-commerce platform.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** PostgreSQL (Neon-compatible)
- **ORM:** Prisma
- **State Management:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd aara-clothing

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## Development

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret for authentication |
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── shared/             # Shared components
│   └── providers/          # React providers
├── features/               # Feature-based modules
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── categories/
│   ├── inventory/
│   ├── customers/
│   └── orders/
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── services/               # API services
├── types/                  # TypeScript types
├── utils/                  # Utility functions
└── prisma/                 # Prisma client
```

## Database

The project uses PostgreSQL with Prisma ORM. To set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio
```

## License

Private - Aara Clothing
