# CivicPulse AI - Multimodal Civic Agent

CivicPulse AI is a high-end submission for the Google Antigravity Hackathon. It leverages Gemini 1.5 Pro and Google Civic Information APIs to provide citizens with a powerful, accessible, and non-partisan platform for civic engagement.

## Features
- **Visual Ballot Decoder**: Upload images of ballots or civic notices for instant AI-powered explanation.
- **Geo-Lookup**: Find local representatives and polling locations in real-time.
- **Smart Calendar Sync**: Export voting deadlines directly to your calendar (.ics).
- **Security First**: Onboarding UI for secure local API key configuration.

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, Vertex AI SDK, Google API Python Client.

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python -m uvicorn main:app --reload`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Access
Open `http://localhost:5173` in your browser. Complete the onboarding wizard with your Google Cloud Project ID and API Keys.

## Accessibility
CivicPulse AI is designed with high contrast and semantic HTML to ensure compatibility with screen readers and compliance with civic accessibility standards.
