# BandGuy Frontend (React)
Real-time collaborative band rehearsal tool — frontend SPA for SyncRock's BandGuy project

BandGuy helps bands rehearse together online with synchronized playback of lyrics and tracks. 
This repository contains the React frontend SPA for local development and testing.

## Features (Proof-of-Concept)
- React SPA for local rehearsal sessions
- Browser-based lyric file caching
- Two track playback types
- WebRTC-based network sync
- Sample login/signout for testing

## Repo Structure
- `/apps` – Each subfolder is a SPA of its own. Instead of one massive SPA, hard to deploy, edit, and large memory/download footprint - break major app areas into their own SPAs. For instance, user profile editing has nothing at all to do with jamming. And, we can unload jam SPA when going to edit user profile, or in track builder modes.
- `/public` – Static assets
- `/tests` – Component/unit tests
- `.storybook` – Storybook UI component explorer
- `vite.config.ts` – Vite build configuration

## Running Locally

1. Clone the repo:
   git clone https://github.com/SyncRock/bandguy-frontend-react.git
2. Install dependencies:
   npm install
3. Start local dev server + WebRTC stub:
   npm run dev (for both express_server and main react)
4. Open the app in your browser at http://localhost:9000

## Tests
- Run unit/component tests:
  npm run test
- Run Storybook:
  npm run storybook

## Contributing
- Use `npm run dev` for local development
- Keep experiments in separate branches
- Storybook components should be documented with examples

## Commnuity

[![Discord](https://img.shields.io/badge/Discord-Join%20the%20Jam%20%F0%9F%8E%B6-%235865F2.svg)](https://discord.gg/YTxrm3M93A)


[![YouTube](https://img.shields.io/badge/YouTube-Follow%20SyncRock-%23FF0000?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/@SyncUpRocksLive)


## License
GPL-3.0 License — see LICENSE file for details.

## Architecture Diagram

![BandGuy Frontend Architecture](assets/flow.png)
