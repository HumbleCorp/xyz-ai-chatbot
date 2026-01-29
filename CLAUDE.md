# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI chatbot application built with Next.js 16 and the Vercel AI SDK. It provides a full-featured chat interface with document collaboration, artifacts (code/text/spreadsheet editors), and multi-model AI support through Vercel AI Gateway.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React Server Components
- **AI**: Vercel AI SDK with AI Gateway for multi-provider model access
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Vercel Blob for file uploads
- **Cache**: Redis (optional, for rate limiting and caching)
- **Authentication**: NextAuth.js v5 (Auth.js)
- **UI**: Tailwind CSS 4, shadcn/ui components, Radix UI primitives
- **Code Quality**: Ultracite (Biome-based linter/formatter)
- **Testing**: Playwright for E2E tests
- **Package Manager**: pnpm

## Development Commands

```bash
# Install dependencies
pnpm install

# Setup database or apply latest migrations
pnpm db:migrate

# Development server with Turbopack
pnpm dev

# Build for production (runs migrations first)
pnpm build

# Start production server
pnpm start

# Linting and formatting
pnpm lint       # Check code with Ultracite (Biome)
pnpm format     # Auto-fix code with Ultracite

# Database operations
pnpm db:generate   # Generate new migration files from schema changes
pnpm db:migrate    # Apply migrations to database
pnpm db:studio     # Open Drizzle Studio (database GUI)
pnpm db:push       # Push schema directly to database (dev only)
pnpm db:pull       # Pull schema from database
pnpm db:check      # Check migration consistency

# Testing
pnpm test          # Run Playwright E2E tests
```

## Architecture

### App Router Structure

The app uses Next.js 16 App Router with route groups:

- `app/(chat)/` - Main chat interface and API routes
  - `app/(chat)/page.tsx` - Chat homepage (redirects to new chat)
  - `app/(chat)/chat/[id]/page.tsx` - Individual chat sessions
  - `app/(chat)/api/` - API route handlers for chat, documents, files, history, suggestions, votes
- `app/(auth)/` - Authentication pages (login/register)
- `app/layout.tsx` - Root layout with theme provider and session management

### Key Directories

- **`lib/`** - Core business logic and utilities
  - `lib/ai/` - AI provider configuration, model definitions, prompts, tools
  - `lib/db/` - Database schema, queries, migrations (Drizzle ORM)
  - `lib/editor/` - ProseMirror document editor utilities
  - `lib/constants.ts` - Global constants
  - `lib/types.ts` - Shared TypeScript types
  - `lib/utils.ts` - Utility functions

- **`components/`** - React components
  - `components/ai-elements/` - AI-specific UI components (message, markdown renderers)
  - Core chat components: `chat.tsx`, `chat-header.tsx`, `message.tsx`, `multimodal-input.tsx`
  - Artifact components: `artifact.tsx`, `document-preview.tsx`, `code-editor.tsx`
  - UI primitives: shadcn/ui components (button, dialog, dropdown, etc.)

- **`artifacts/`** - Artifact type implementations
  - `artifacts/text/` - Text document editor (ProseMirror)
  - `artifacts/code/` - Code editor (CodeMirror)
  - `artifacts/sheet/` - Spreadsheet editor (react-data-grid)
  - `artifacts/image/` - Image generation/display

- **`hooks/`** - Custom React hooks for chat, suggestions, scroll, etc.

- **`tests/`** - Playwright E2E tests

### Database Schema

Core tables (see `lib/db/schema.ts`):

- `User` - User accounts with email/password
- `Chat` - Chat sessions (public/private visibility)
- `Message_v2` - Chat messages with parts and attachments (new format)
- `Vote_v2` - Message voting (upvote/downvote)
- `Document` - Collaborative documents (text/code/image/sheet kinds)
- `Suggestion` - Document editing suggestions
- `Stream` - Active streaming sessions

Note: `Message` and `Vote` tables are deprecated; use `Message_v2` and `Vote_v2`.

### AI Integration

**Model Configuration** (`lib/ai/models.ts`):
- Default model: `google/gemini-2.5-flash-lite`
- Supports multiple providers: Anthropic (Claude), OpenAI (GPT), Google (Gemini), xAI (Grok)
- Reasoning models available with `-thinking` suffix

**Provider Setup** (`lib/ai/providers.ts`):
- Uses Vercel AI Gateway for unified model access
- Reasoning models use `extractReasoningMiddleware` with `<thinking>` tags
- Test environment uses mock models

**AI Tools** (`lib/ai/tools/`):
- `create-document.ts` - Create new collaborative documents
- `update-document.ts` - Update existing documents
- `request-suggestions.ts` - Generate document editing suggestions
- `get-weather.ts` - Example weather tool

### Authentication

Uses NextAuth.js v5 with credentials provider. Configuration in `app/(auth)/auth.config.ts`. Users stored in PostgreSQL with bcrypt password hashing.

### Artifacts System

Artifacts are collaborative documents that appear in a side panel:
- **Text**: Rich text editor using ProseMirror
- **Code**: Syntax-highlighted code editor using CodeMirror
- **Sheet**: Spreadsheet editor using react-data-grid
- **Image**: Image generation and display

Artifacts support real-time suggestions and collaborative editing.

## Environment Variables

Required variables (see `.env.example`):

```bash
# NextAuth secret (generate with: openssl rand -base64 32)
AUTH_SECRET=****

# Vercel AI Gateway (auto-configured on Vercel via OIDC)
AI_GATEWAY_API_KEY=****

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=****

# PostgreSQL database
POSTGRES_URL=****

# Redis (optional)
REDIS_URL=****
```

## Code Quality Standards

This project uses **Ultracite** (Biome-based) for linting and formatting. Key rules:

- **TypeScript**: Strict type safety, no `any`, no enums, use `import type` for types
- **React**: No array index keys, proper hook dependencies, no component definition in components
- **Accessibility**: Proper ARIA attributes, semantic HTML, keyboard navigation
- **Style**: Use arrow functions, optional chaining, template literals, `const` by default
- **No console**: Remove console statements before committing (except errors)
- **No bitwise operators**: Avoid bitwise operations

Run `pnpm lint` before committing. Auto-fix with `pnpm format`.

## Testing

E2E tests use Playwright. Tests are in `tests/` directory.

```bash
# Run all tests
pnpm test

# Run tests in UI mode
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test tests/chat.spec.ts
```

Test environment automatically uses mock AI models (see `lib/ai/models.mock.ts`).

## Deployment

This application is designed for Vercel deployment:

1. Push to GitHub
2. Connect to Vercel
3. Environment variables are auto-configured via Vercel integrations (AI Gateway, Blob, Postgres, Redis)
4. Migrations run automatically during build (`pnpm build`)

For non-Vercel deployments, manually configure all environment variables and ensure `AI_GATEWAY_API_KEY` is set.

## Important Notes

- **Migrations**: Always run `pnpm db:migrate` after pulling schema changes
- **Type Generation**: Drizzle types are auto-generated from schema
- **Turbopack**: Dev server uses Turbopack for faster builds (`--turbo` flag)
- **Deprecations**: Avoid using `Message` and `Vote` tables; use `Message_v2` and `Vote_v2`
- **AI Gateway**: Model IDs include provider prefix (e.g., `anthropic/claude-sonnet-4.5`)
- **Reasoning Models**: Add `-thinking` suffix to enable extended reasoning mode
