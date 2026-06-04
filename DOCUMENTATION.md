# D-EAN Technical Specification & Documentation

## 1. Executive Summary
**D-EAN (Decentralized Emergency Assistance Network)** is a resilient, community-driven emergency coordination platform. Unlike traditional emergency systems that rely entirely on centralized servers and stable internet, D-EAN is built to survive network partitioning and internet outages using a "Dual-Mode" communication strategy.

---

## 2. The Problem Statement
In major disasters (floods, earthquakes, riots), two things often happen simultaneously:
1.  **Network Congestion/Failure**: Local cell towers or internet backbones go down.
2.  **Emergency Spike**: The demand for help reaches its peak exactly when the tools to request it fail.

Current apps (WhatsApp, Uber, etc.) are "Cloud-Only." If the server is unreachable, the app is useless.

---

## 3. The D-EAN Solution: Dual-Mode Networking
D-EAN uses a hybrid architecture to ensure "The SOS Always Gets Through."

### A. Cloud Mode (Primary)
- **Engine**: Supabase Realtime + PostgreSQL.
- **Workflow**: When a user triggers an SOS, it is sent to a central database. Responders subscribed to that "Zone" receive an instant push notification via WebSocket.
- **Best For**: Normal operations, coordinating across distant neighborhoods, and long-term logging.

### B. P2P Mode (Fallback/Local Mesh)
- **Offline Simulation**: Integrated developers toggle in context to bypass standard connectivity checks for prototype testing.
- **Engine**: Browser `BroadcastChannel` API.
- **Workflow**: If the internet is detected as down, the app switches to P2P mode. It broadcasts the SOS locally to all other open D-EAN tabs on the same origin (e.g., in a community center or local mesh network).
- **Best For**: Hyper-local coordination within a building or neighborhood when the ISP fails.

---

## 4. Technical Stack & Rationale

### Frontend: Next.js 14 (App Router)
- **Why?**: The App Router allows for a clean separation between User, Responder, and Admin dashboards via **Route Grouping** `(auth)`, `(user)`, `(admin)`.
- **Styling**: Tailwind CSS for high-fidelity, responsive UI that feels "premium" and "urgent."

### Real-Time: Supabase
- **Why?**: Supabase provides an "all-in-one" backend (Auth, DB, Realtime) which is critical for a prototype. Its **Realtime Service** allows responders to see new alerts pop up on the map without refreshing.

### Mapping: React-Leaflet
- **Why?**: Leaflet is lightweight and open-source. Unlike Google Maps, it doesn't require an API key that might fail or cost money during a disaster. We used **CartoDB Dark Matter** tiles for a high-contrast "Emergency" aesthetic.

---

## 5. The "Zero-Auth" Prototype Philosophy
For the purpose of this prototype, we implemented a **Zero-Auth bypass**.
- **Rationale**: In a demo environment, asking users to register and verify email is a friction point.
- **Implementation**: We "gutted" the login screens and replaced them with a direct-access role selector. In the background, the app uses **Fixed Mock UUIDs** to interact with the database, ensuring that all relational features (Timeline, Logs) still work without a password.

---

## 6. Database Schema Deep-Dive

### `profiles`
The master record for every person in the network.
- `role`: Determines the dashboard the user sees.
- `zone`: Used to filter alerts for responders in specific areas (e.g., Mangaluru Central).

### `alerts`
The central transaction table.
- `alert_code`: Human-readable identifier (e.g., DEAN-1042).
- `location_lat/lng`: Geolocation of the distress signal.
- `routing_mode`: Tracks if the alert was sent via Cloud or P2P.

### `alert_timeline`
A history of every state change. Essential for auditing how long it took for a responder to reach the scene.

---

## 7. Engineering Challenges & Solutions

### Challenge A: The "Rogue Lockfile" Poisoning
During development, the project was "poisoned" by a `package-lock.json` in a parent directory, forcing an unstable Next.js version (v16).
- **Solution**: We identified the root-detection error, deleted the parent lockfile, and performed a clean `npm install` to revert to stable Next.js 14.

### Challenge B: Map Container Initialization
Leaflet often conflicts with React's re-rendering (especially with HMR), leading to the "Map container already initialized" error.
- **Solution**: We implemented a **Wrapper-Key Strategy**. By giving the parent `div` of the map a unique, randomized key, we force React to destroy the old DOM node and create a fresh one, ensuring Leaflet starts with a clean slate every time.

---

## 8. Future Roadmap
1.  **WebRTC Mesh**: Expanding P2P mode to work across different devices using WebRTC (not just the same origin).
2.  **PWA (Progressive Web App)**: Enabling full offline installation so users can access D-EAN even with zero bars of signal.
3.  **Voice-to-SOS**: Integrating AI to allow users to trigger an SOS by shouting "HELP" when they can't reach their phone.

---

## 9. Conclusion
D-EAN is more than a dashboard; it is a blueprint for resilient community infrastructure. By combining the power of the modern Cloud with the resilience of P2P networking, we ensure that help is never more than a broadcast away.

---

## 10. Premium Component Suite

To ensure a "Mission-Critical" feel, we implemented a suite of premium components:

- **SOSButton (Hold-to-Confirm)**: Prevents accidental triggers by requiring a 1.5s hold, accompanied by a SVG progress ring and haptic feedback.
- **NetworkStatus Monitor**: Real-time tracking of internet connectivity with automatic fallback notifications to "P2P Mesh Mode."
- **GlobalLoader & LoadingDots**: Consistent, high-fidelity loading states using Framer Motion for a fluid user experience.
- **AlertTimeline (Live)**: An interactive, animated ledger of emergency progress with pulsing "Active" indicators.
- **Premium Map Markers**: SVG-based markers with status-aware colors and pulse animations for high-priority alerts.
- **Glassmorphism UI**: Custom CSS utilities for backdrop-blur effects and sophisticated dark-mode gradients.

---

## 11. Design Philosophy: "Urgency meets Elegance"

D-EAN's UI is designed with three principles:
1. **High Contrast**: Using deep blacks (#0A0E1A) and vibrant SOS reds (#FF2D55) to ensure readability in stressful situations.
2. **Physical Feedback**: Integrating the Vibration API (Haptics) and Framer Motion spring physics to make digital actions feel "real."
3. **Information Density**: Using custom Badges and StatusPills to convey complex metadata (routing mode, emergency type, distance) at a single glance.

---

## 12. Final Thoughts
With the latest improvements in UX and real-time synchronization, D-EAN stands as a production-grade demonstration of decentralized emergency response.


## 13. Voice Feedback Integration
Text-to-speech feedback is integrated to read out active responder updates for sight-impaired users.


### P2P Message Protocol Sequence

When communication channels fail, peer messages are wrapped into heartbeats that carry current sync sequence numbers.