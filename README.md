# RecordFlow

A modern, offline-first record-keeping Progressive Web App (PWA) designed specifically for educators to manage hierarchical educational data. Built with Vue 3 and Firebase, it provides seamless offline capabilities with GitHub Desktop-like synchronization.

## Features

### Core Features
- Hierarchical Data Management
  - Grade Levels
  - Subjects
  - Classes
  - Class Records

### Offline-First Architecture
- GitHub Desktop-like Workflow:
  - Local-first data storage using Dexie.js
  - Automatic change tracking and commits (default: 5-minute intervals)
  - Configurable auto-push when online (default: 15-minute intervals)
  - Smart conflict detection and resolution
  - Manual sync controls when needed

### Authentication System
- Multiple Authentication Methods:
  - Email/Password Authentication
  - Google Sign-in Integration
  - Smart Authentication Upgrade
- Enhanced Security:
  - Universal 24-hour token expiration
  - 6-hour warning window for renewal
  - Automatic token refresh for online users
  - Manual reconnection for offline users
  - Encrypted local credential storage

### Progressive Web App Features
- True offline-first capabilities:
  - Local-first storage with Dexie.js
  - Automatic background sync
  - Change tracking and version control
  - Conflict resolution system
- Native app-like experience:
  - Installable PWA
  - Push notifications for sync status
  - Background updates
  - Cross-platform support

### Real-time Cloud Features
- Smart bi-directional sync with Firebase:
  - Automatic commit grouping
  - Intelligent conflict resolution
  - Background synchronization
  - Cross-device consistency
- Data persistence and backup

### Modern UI/UX
- Built with ShadCN Vue components
- Responsive design
- Dark mode support
- Toast notifications
- Sync status indicators

## Tech Stack

- Vue.js 3 (Composition API)
- Vite + Vite Plugin PWA
- Firebase (Auth, Firestore, Storage)
- Dexie.js for IndexedDB management
- TailwindCSS
- ShadCN Vue
- Pinia for state management
- Vue Router
- Radix Icons Vue

## Architecture

### Database Structure (Dexie.js)
```javascript
{
  gradeLevels: '++id, name, createdAt, updatedAt, syncStatus',
  changes: '++id, timestamp, type, entityId, syncStatus',
  syncMeta: 'id, lastSync, status',
  auth: 'id, tokens, expiry'
}
```

### Auto-Sync System
```javascript
const syncConfig = {
  autoCommit: {
    enabled: true,
    interval: 5 * 60 * 1000  // 5 minutes
  },
  autoPush: {
    enabled: true,
    interval: 15 * 60 * 1000 // 15 minutes
  }
}
```

### Authentication Flow
```javascript
const AUTH_CONFIG = {
  expiryTime: 24 * 60 * 60 * 1000,    // 24 hours
  warningWindow: 6 * 60 * 60 * 1000,   // 6 hours
  checkInterval: 15 * 60 * 1000        // 15 minutes
}
```

## Project Structure

```
src/
├── components/      # Vue components
│   ├── auth/       # Authentication components
│   ├── sync/       # Sync management components
│   └── ui/         # ShadCN Vue components
├── composables/    # Vue composables
├── lib/           # Core utilities
│   ├── db/       # Dexie.js setup
│   ├── sync/     # Sync management
│   └── auth/     # Auth management
└── stores/        # Pinia stores
    ├── auth/     # Auth state management
    └── sync/     # Sync state management
```

## Setup & Development

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/rjml1128/recordflow.git
cd recordflow

# Install dependencies
npm install
```

### 2. Configuration
Create a `.env.local` file with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

## User Preferences

### Sync Settings
Users can configure their sync preferences:
- Auto-commit interval (1-60 minutes)
- Auto-push interval (5-60 minutes)
- Enable/disable automatic sync
- Sync notifications

### Authentication Settings
- Choose authentication method
- Configure token refresh warnings
- Set offline access preferences

## Troubleshooting

### Sync Issues
1. **Changes Not Syncing**
   - Check internet connection
   - Verify sync settings are enabled
   - Check sync status indicator
   - Try manual sync if needed

2. **Sync Conflicts**
   - Review conflict details
   - Choose correct version
   - Manually merge if needed
   - Reset sync state if necessary

3. **Authentication Errors**
   - Check token expiration
   - Ensure proper login method
   - Clear local storage if needed
   - Re-authenticate if required

### Offline Mode
1. **Data Access**
   - All data available offline
   - Changes tracked locally
   - Commits stored until online
   - Background sync when possible

2. **Token Expiration**
   - Warning notifications
   - Grace period for reconnection
   - Local validation maintained
   - Secure credential storage

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
