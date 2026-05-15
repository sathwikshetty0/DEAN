# D-EAN Developer Guide

Welcome to the **Decentralized Emergency Assistance Network (D-EAN)**. This guide outlines the project's architecture, key technologies, and the mechanics behind our resilient SOS system.

## 🏗️ Architecture Overview

D-EAN is built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. It is designed to be a **Resilient Web App**, capable of functioning even during internet outages.

### Core Technologies
- **Frontend**: Next.js (App Router), Framer Motion (Animations), Leaflet (Maps).
- **Backend**: Supabase (Auth, DB, Real-time), Next.js API Routes.
- **Resilience**: PWA (Service Workers), IndexedDB v2 (Offline Storage), BroadcastChannel API (P2P Mesh Simulation).

## 📡 Resilience Protocol (How it works)

D-EAN implements a dual-routing system for emergency alerts:

1.  **Cloud Mode (Online)**:
    - Alerts are sent directly to Supabase via standard HTTP POST requests.
    - Responses are standardized using `apiSuccess` and `apiError` utilities.
    - Real-time updates are received via Supabase Postgres Changes.

2.  **P2P Mesh Mode (Offline)**:
    - When `navigator.onLine` is false, the app switches to P2P mode.
    - Alerts are stored in **IndexedDB** (v2) with background sync capabilities.
    - Alerts are broadcasted locally using the **BroadcastChannel API**.
    - A Service Worker (`public/sw.js`) handles exponential backoff retries for background synchronization.

## 🛡️ Security & Validation

- **Backend Validation**: All API routes use **Zod** for schema validation to ensure data integrity.
- **Role-Based Access**: Administrative routes are protected by the `verifyAdmin` utility, enforcing strict role checks on the server side.
- **Haptic Simulation**: SOS triggers include cinematic haptic feedback (screen shake, flash effects) to confirm intent.

## 🎨 Design System

D-EAN uses a premium design system based on:
- **Glassmorphism**: Reusable `GlassCard` component for high-fidelity UI.
- **Dynamic Icons**: Standardized map iconography via `useEmergencyMap` hook.
- **Motion**: Unified page transitions and micro-animations via `Framer Motion`.

## 📁 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components.
  - `/shared`: Global components like `Badge`, `StatusPill`, `NetworkStatus`, `GlassCard`.
  - `/admin`: Command Center specific components.
- `/context`: React Context providers for Auth, Network, and Alerts.
- `/hooks`: Custom hooks for Maps, Real-time, Geolocation, etc.
- `/lib`: Utility functions, Zod validations, and Supabase config.

## 🛠️ Development Workflow

### Prerequisites
- Node.js 18+
- Supabase account and project.

### Setup
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up environment variables: Copy `.env.example` to `.env.local` and fill in credentials.
4.  Run the development server: `npm run dev`

### Commit Guidelines
We follow a granular commit strategy (20-commit sprints) to ensure high-quality, documented progress. Each commit must be single-purpose and production-ready.

---
*Built for Mangaluru. Built for Resilience.*
