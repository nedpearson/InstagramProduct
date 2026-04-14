# Instagram Content Automation

A fully automated Instagram digital-product content engine with a clean architecture and local companion workflow.

## Architecture

This system uses a Next.js (App Router) full-stack architecture with Prisma and SQLite (for easy local setup). The codebase follows a clean monolithic architecture suitable for local Windows operation.

### Layers

1.  **Frontend Dashboard:** UI components in `src/app`. Tailored dynamically from the DB to visualize Briefs, Schedules, and Analytics.
2.  **API Services:** Next.js Route handlers in `src/app/api`. (Example: `/api/brief/[id]/generate`). Responsible for receiving commands and pushing secure jobs into the queue.
3.  **Local Automation Companion:** A durable `Node.js` worker (`src/script/companion.ts`). It polls the local database for queued operations (like API calls to generate content or local file writing) ensuring nothing heavy runs strictly in the UI process, providing Windows-safe resilience without requiring Docker/Redis.
4.  **Data Layer:** Prisma ORM connected to local `dev.db`.

## PowerShell Commands

Use the following commands directly inside the repository to operate the system locally:

**1. Install Dependencies**
```powershell
npm install
```

**2. Setup / Migrate Database**
```powershell
npx prisma generate
npx prisma db push
```

**3. Seed Demo Data**
```powershell
npm run seed
```

**4. Start Application & Companion Service (All in one)**
```powershell
npm run dev:all
```
*(This uses concurrently to launch Next.js on `localhost:3000` alongside the backend job processor.)*

**5. Start ONLY the Companion Worker**
```powershell
npm run worker
```

## Known Limitations & Next Steps

-   **Instagram API Connection:** The DB model supports full Meta graph integrations (`InstagramAccount` and `IntegrationToken`). However, OAuth flow requires your active Developer App credentials inside an `.env` file first.
-   **Content Generation Engine:** `src/script/companion.ts` handles the queue. The function `handleGenerateJob` currently simulates a 2-second LLM delay. You must insert your Anthropic/OpenAI API key and fetch real tokens here.
-   **Publishing Auto-fallback:** To fully post without Meta's official API, the system queues `ReviewTasks`. For operator posting, a manual button in the queue handles unsupported reels safely without phantom headless-browser scripting, adhering strictly to platform safety rules.

## Security

Zero hidden scripts. The companion runs transparently via `.ts` node commands, outputs clearly to the console, and respects local data perimeters.
