# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DRESSENSE landing page - a presentation/marketing page for the DRESSENSE AI fashion platform. Built with React, TypeScript, Vite, and Tailwind CSS.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production (runs TypeScript check first)
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite 6** for build tooling
- **Tailwind CSS 3** with CSS custom properties for theming
- **Framer Motion** for animations

### Project Structure

```
src/
├── components/
│   └── LandingPage.tsx    # Full-page scrolling presentation with 9 animated sections
├── styles/
│   └── tokens.css         # CSS custom properties (colors, typography, shadows, etc.)
├── utils/
│   └── cn.ts              # clsx + tailwind-merge utility
├── index.css              # Tailwind imports + base styles + utility classes
├── App.tsx                # Root component with onEnter callback
└── main.tsx               # React entry point
```

### Path Alias
`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`)

### Design System

The design uses CSS custom properties defined in `src/styles/tokens.css`:
- **Colors**: Dark mode default with accent color `#EE344A`
- **Typography**: Pretendard (Korean font) + JetBrains Mono (loaded via CDN in index.html)
- **Custom Tailwind classes**: `glass` (glassmorphism), `gradient-text`, `no-scrollbar`, `gpu`

### LandingPage Component

Single-file component containing all sections as internal functions. Sections are marked with `data-section` attribute for keyboard navigation (arrow keys).

Sections in order:
1. IntroStorySection - Character introduction with phone mockup
2. StoryJourneySection - Video-based storytelling
3. TransitionSection - Question text
4. BrokenChainSection - Animated chain-breaking visualization
5. QuestionSection - Bridge text
6. BrandRevealSection - Brand name animation
7. VideoHeroSection - Full-screen video
8. CTASection - Call to action with "시작하기" button
9. Footer

The `onEnter` prop is passed to control what happens when CTA button is clicked.
