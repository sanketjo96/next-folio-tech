---
title: "News Pulse: Top News and Trends Dashboard"
summary: "A one-page dashboard of the top stories for the world, India and Maharashtra, plus what people are searching and talking about right now, with short plain-English summaries."
thumbnail: "/images/projects/news-pulse.jpg"
author: "Sanket Joshi"
publishDate: "2026-11-12"
links:
  - label: "Live page"
    url: "https://sanketjo96.github.io/news-pulse/"
  - label: "Source code"
    url: "https://github.com/sanketjo96/news-pulse"
---

## Summary
Keeping up with the news usually means several apps and a lot of scrolling. News Pulse puts it on one page: the top 3 stories each for the world, India and Maharashtra, the top Google searches from India, and a social section with X trends for India and viral Instagram stories.

## How it works
- Reads Google News and Google Trends RSS feeds, so it needs no paid news API
- An LLM writes a short, plain-English summary for every story and trend, pitched at a 15-year-old; only new topics are sent and earlier summaries are reused to keep costs down
- Runs as a small Express server that caches feeds for 15 minutes, or as a static site
- On GitHub Pages, a GitHub Actions job snapshots every section into a data file and redeploys every 30 minutes, so the page stays fresh with no server to run

## Technology
- React
- Node.js
- Express
- Vite
- GitHub Actions
- Groq / OpenAI
