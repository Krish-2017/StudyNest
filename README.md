# StudyNest — MDU B.Tech Notes

StudyNest is a responsive notes library for MDU Rohtak B.Tech students. It includes note filters, bookmarks, previews, a moderated upload prototype, and an AI study assistant that runs in an honest demo mode until a provider is configured.

## Run locally

Requirements: Node.js 18 or newer.

```bash
cp .env.example .env
npm start
```

Open `http://localhost:3000`. The app works in demo mode without any credentials.

## Configure AI securely

Set environment variables in your host dashboard, not in `index.html`, the Git repository, or browser dev tools.

### OpenAI

Set `AI_PROVIDER=openai`, `OPENAI_API_KEY`, and optionally `OPENAI_MODEL`. The server calls OpenAI's server-side Responses API. The browser only calls the app's `/api/ai` route.

### Google Gemini

Set `AI_PROVIDER=gemini`, `GEMINI_API_KEY`, and optionally `GEMINI_MODEL`. The server calls Gemini's server-side `generateContent` route.

## Deploy to Render

1. Create a GitHub repository and commit these files at its root.
2. In Render, choose **New → Blueprint** and connect that repository. Render will detect `render.yaml`.
3. Add the environment variables for the provider you chose. Do not add any secret to the repository.
4. Deploy. Confirm `https://YOUR-SERVICE.onrender.com/api/health` returns `{ "ok": true }`.

The Render free plan can spin down when idle. Configure a paid instance if instant availability is important.

## Production next steps

The current notes and uploads are realistic local demo data. A production version should add authentication, object storage for uploads, a database, malware/file checks, a moderation queue, rate limits, and a server-side note-retrieval pipeline before grounding AI answers in user-uploaded PDFs.
