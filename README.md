# TIT&S Notes — Bhiwani B.Tech Study Hub

Dark-theme student notes platform for Technological Institute of Textile Sciences (TIT&S), Bhiwani.

Features:
- TIT&S-inspired emblem based on the supplied logo
- Branch and semester filters
- Built-in B.Tech study notes
- PYQ section
- AI Study Assistant
- OpenAI or Gemini server-side integration
- Upload-material UI
- Responsive design

The organization is inspired by the general academic-platform structure described publicly for NotesNeo, while using original branding and implementation.

## Local
Requires Node.js 18+.
```bash
cp .env.example .env
npm start
```

## AI
Keep keys server-side. Set AI_PROVIDER and the matching provider key on your hosting platform.

## Deployment
The repository includes render.yaml for a Node web service. Connect the repo to Render as a Blueprint and add the AI environment variables.

The included notes are project-created study material, not official TIT&S course material. Verify them against the current syllabus and faculty resources.
