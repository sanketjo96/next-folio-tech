---
title: "Saral Society: Housing Society Management"
summary: "Billing and day-to-day management for small housing societies: monthly maintenance, UPI collection with proof review, and numbered CHS-format receipts on WhatsApp and email."
thumbnail: "/images/projects/saral-society.jpg"
author: "Sanket Joshi"
publishDate: "2026-11-06"
links:
  - label: "Live site"
    url: "https://sanketjo96.github.io/housing-society-management/"
  - label: "Try the demo"
    url: "https://sanketjo96.github.io/housing-society-management/demo/"
  - label: "Source code"
    url: "https://github.com/sanketjo96/housing-society-management"
---

## Summary
Small housing societies run on volunteer committees. The treasurer keeps dues in a spreadsheet, chases each flat on WhatsApp, matches UPI screenshots against the bank statement by hand and writes receipts in a carbon book. Apps built for large gated communities charge per flat and still don't produce the receipts a co-operative housing society (CHS) audit expects.

Saral Society replaces all of that with one passbook per flat. I designed and built it for my own 24-flat society, for societies of 10 to 150 flats.

## What it does
- Charges monthly maintenance on the 1st automatically, at owner or tenant rates
- Residents pay by UPI QR or bank transfer and upload proof; the treasurer approves or rejects it
- Every approved payment gets a sequential, gap-free receipt in CHS format, sent on WhatsApp and email
- Ad-hoc charges, society income and expenses, and an admin dashboard of who owes what
- Separate admin, owner and tenant views; an owner and tenant of the same flat share one passbook

## How it's built
- A route, controller and service split per business domain, with every query scoped to its society
- Balances and paid/unpaid status are derived from the underlying rows on every read, never stored
- Idempotent monthly billing job, audit log for every financial action, and uploaded proof files checked by content, not just file type
- Self-hosted with Docker Compose, Nginx and free Let's Encrypt HTTPS, to keep running costs near zero
- A clickable front-end demo and marketing site, published to GitHub Pages only after the demo checks pass

## Technology
- React
- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma
- React Query
- Docker
