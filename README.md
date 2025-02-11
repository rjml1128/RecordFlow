# RecordFlow

A modern, offline-first record-keeping Progressive Web App (PWA) designed specifically for educators to manage hierarchical educational data. Built with Vue 3 and Firebase, it provides seamless offline capabilities with automatic synchronization when online.

## Features

- Hierarchical Data Management
  - Grade Levels
  - Subjects
  - Classes
  - Class Records
- Authentication System
  - Email/Password Authentication
  - Google Sign-in Integration
  - Smart Authentication Upgrade (automatically upgrades to Google sign-in when available)
- Progressive Web App (PWA) Features
  - True offline-first architecture
  - Local-first storage with Dexie.js (IndexedDB wrapper) for:
    - Fast, reliable data access
    - Complex indexing capabilities
    - Structured database schema
  - Intelligent background sync with conflict resolution
  - Native app-like experience with installable PWA
  - Automatic updates when new versions are available
- Real-time Cloud Features
  - Bi-directional sync with Firebase
  - Conflict resolution strategies
  - Data persistence across devices
- Modern UI/UX
  - Built with ShadCN Vue components
  - Responsive design for all devices
  - Dark mode support

## Tech Stack

- Vue.js 3 (Composition API)
- Vite + Vite Plugin PWA
- Firebase
  - Authentication
  - Firestore
  - Storage
- Dexie.js (IndexedDB wrapper)
  - Structured database schema
  - Complex querying capabilities
  - Promise-based API
- TailwindCSS for styling
- ShadCN Vue for UI components
- Pinia for state management
- Vue Router for navigation
- Radix Icons Vue for icon system

## Setup

1. Clone the repository
```bash
git clone https://github.com/rjml1128/recordflow.git
cd recordflow
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your Firebase configuration
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint and fix files
npm run lint
```

## Troubleshooting

### Common Issues

1. **Authentication Switching**
   - If you previously used email/password login and then sign in with Google using the same email, the account will automatically upgrade to use Google authentication.
   - After upgrading to Google authentication, you must use the "Sign in with Google" option.

2. **Offline Mode**
   - Ensure your browser supports Service Workers and IndexedDB
   - Check if the app is properly installed as a PWA for full offline capabilities
   - Data will automatically sync when connection is restored

3. **PWA Installation**
   - Make sure you're running the app from a secure origin (HTTPS)
   - Clear browser cache if installation prompt doesn't appear
   - Some browsers may require user interaction before showing install prompt

4. **Development Issues**
   - Clear browser cache and local storage when testing authentication changes
   - Run `npm clean-install` to resolve dependency issues
   - Check `.env.local` configuration if Firebase features aren't working

## Project Structure

```
src/
├── App.vue           # Root component
├── main.js          # Application entry point
├── assets/          # Static assets
├── components/      # Vue components
│   ├── icons/      # Icon components
│   ├── ui/         # ShadCN Vue components
│   ├── auth/       # Authentication components
│   ├── grades/     # Grade level components
│   ├── subjects/   # Subject components
│   ├── classes/    # Class components
│   └── records/    # Class record components
├── composables/     # Vue composables
├── lib/            # Utilities and configurations
│   ├── db.js      # IndexedDB configuration
│   ├── firebase.js # Firebase configuration
│   └── utils.js    # Utility functions
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
│   ├── auth.js     # Authentication store
│   ├── grades.js   # Grade levels store
│   ├── subjects.js # Subjects store
│   ├── classes.js  # Classes store
│   └── records.js  # Class records store
└── views/          # Page components
    ├── auth/       # Authentication views
    ├── dashboard/  # Dashboard views
    ├── grades/     # Grade level views
    ├── subjects/   # Subject views
    ├── classes/    # Class views
    └── records/    # Record views
```

## Development Practices

- **Component Naming**:
  - PascalCase for components (e.g., `GradeList.vue`)
  - camelCase for utilities (e.g., `dataService.js`)
  - kebab-case for assets (e.g., `grade-icon.svg`)

- **Code Organization**:
  - Hierarchical component architecture
  - Clear separation of data levels
  - Nested routing patterns
  - Component-based architecture
  - Utility-first CSS with Tailwind

## Technical Requirements

- Modern browsers with:
  - Service Worker support
  - IndexedDB support
  - PWA installation capabilities
- Secure origin (HTTPS) for PWA features
- Node.js for development

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
