# CrisisOps

<p align="center">
  <img src="public/pwa-512x512.svg" alt="CrisisOps Logo" width="120" height="120" />
</p>

<p align="center">
  <strong>Coordination. Response. Survival.</strong>
</p>

<p align="center">
  A mobile-first Progressive Web App for emergency relief coordination and disaster response. CrisisOps empowers communities with offline survival guides, incident reporting, and location-based hazard information.
</p>

---

## Features

### 🚨 Emergency Response
- **One-Tap Emergency Calls** - Quick access to call emergency services with pre-call safety checklists
- **Incident Reporting** - Multi-step form to report hazards with severity, location, media, and details
- **Offline Queue** - Reports are queued locally and sync automatically when back online

### 📱 Offline-First Architecture
- **Works Without Internet** - Full functionality even when disconnected
- **IndexedDB Storage** - Persistent local storage for reports, guides, and hazard packs
- **Background Sync** - Automatic synchronization when connection is restored
- **Service Worker** - PWA support with caching strategies for offline assets

### 🗺️ Location-Based Hazard Packs
- **Regional Emergency Numbers** - Download local emergency contacts
- **Shelter Locations** - Access nearby emergency shelters with capacity info
- **Local Safety Notes** - Region-specific survival tips and warnings
- **Offline Maps Data** - Essential location data cached for offline use

### 📚 Survival Library
- **9 Hazard Categories** - Flood, Fire, Medical, Road Accident, Building Collapse, Earthquake, Extreme Cold, Blizzard, Avalanche
- **Step-by-Step Guides** - "Do Now" and "Do Not" checklists
- **Emergency Scripts** - Pre-written templates for calling emergency services
- **Save for Offline** - Download guides to access without internet

### 🎨 Modern Design
- **Dark Theme** - Eye-friendly interface optimized for emergency situations
- **Animated Splash Screen** - Professional loading experience with progress indicator
- **Mobile-First** - Designed for touch with large tap targets and safe-area support
- **Smooth Animations** - Micro-interactions for enhanced user experience

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Icons | Lucide React |
| Storage | IndexedDB via `idb` |
| PWA | vite-plugin-pwa + Workbox |

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crisisops.git
cd crisisops

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── hazard/          # Hazard cards and grid
│   ├── layout/          # PageContainer, TopStatusBar, BottomNav
│   └── ui/              # Button, Card, StatusChip
├── hooks/
│   ├── useLocation.ts   # Geolocation hook
│   ├── useOnlineStatus.ts # Network status hook
│   └── useReportQueue.ts # Report queue management
├── lib/
│   ├── db.ts            # IndexedDB operations
│   ├── hazards.ts       # Hazard types and survival guides
│   └── sync.ts          # Report synchronization
├── pages/
│   ├── Splash.tsx       # Animated landing screen
│   ├── Onboarding.tsx   # Welcome slides
│   ├── Home.tsx         # Dashboard
│   ├── Survival.tsx     # Hazard library
│   ├── SurvivalDetail.tsx # Guide details
│   ├── Report.tsx       # Incident reporting form
│   ├── MyReports.tsx    # Report history
│   ├── EmergencyCall.tsx # Emergency call screen
│   └── HazardPack.tsx   # Local hazard pack management
├── App.tsx              # Router configuration
├── main.tsx             # Entry point with PWA registration
└── index.css            # Global styles and theme tokens
```

---

## PWA Features

CrisisOps is a fully installable Progressive Web App:

- **Installable** - Add to home screen on mobile devices
- **Offline Support** - Works without internet connection
- **Push Notifications** - Background sync notifications (when supported)
- **App-like Experience** - Standalone display mode, custom splash screen

### Installing on Mobile

1. Open the app in Chrome/Safari
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Lucide Icons](https://lucide.dev/) for the beautiful icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing-fast build tool

---

<p align="center">
  <strong>Stay Safe. Stay Prepared. Save Lives.</strong>
</p>
