# D-EAN Developer Guide

Welcome to the **Decentralized Emergency Assistance Network (D-EAN)**. This guide outlines the project's architecture, key technologies, and the mechanics behind our resilient SOS system.

## 🏗️ Architecture Overview

D-EAN is built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. It is designed to be a **Resilient Web App**, capable of functioning even during internet outages.

### Core Technologies
- **Frontend**: Next.js (App Router), Framer Motion (Animations), Leaflet (Maps).
- **Backend**: Supabase (Auth, DB, Real-time), Next.js API Routes.
- **Resilience**: PWA (Service Workers), IndexedDB (Offline Storage), BroadcastChannel API (P2P Mesh Simulation).

## 📡 Resilience Protocol (How it works)

D-EAN implements a dual-routing system for emergency alerts:

1.  **Cloud Mode (Online)**:
    - Alerts are sent directly to Supabase via standard HTTP POST requests.
    - Real-time updates are received via Supabase Postgres Changes.

2.  **P2P Mesh Mode (Offline)**:
    - When `navigator.onLine` is false, the app switches to P2P mode.
    - Alerts are stored in **IndexedDB** using the `idb` library.
    - Alerts are broadcasted locally using the **BroadcastChannel API** to other open tabs/windows in the same origin.
    - A Service Worker (`public/sw.js`) handles background synchronization when the connection is restored.

## 📁 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components.
  - `/shared`: Global components like `Badge`, `StatusPill`, `NetworkStatus`.
  - `/admin`: Command Center specific components.
- `/context`: React Context providers for Auth, Network, and Alerts.
- `/lib`: Utility functions, types, and Supabase client/server configurations.
- `/supabase`: Database migrations and types.

## 🛠️ Development Workflow

### Prerequisites
- Node.js 18+
- Supabase account and project.

### Setup
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up environment variables: Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
4.  Run the development server: `npm run dev`

### Commit Guidelines
We follow a granular commit strategy to ensure clarity and easy rollbacks. Each commit should focus on a single improvement or feature.

## 🆘 Troubleshooting

- **Map not loading**: Check if `leaflet` CSS is imported and the API keys are correct.
- **PWA not registering**: Ensure you are running on `localhost` or `https`. PWA features are disabled on insecure origins.
- **Offline Sync issues**: Inspect the IndexedDB `dean-offline-storage` in the browser dev tools.

---
*Built for Mangaluru. Built for Resilience.*
