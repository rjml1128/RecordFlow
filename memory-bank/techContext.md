# Technical Context

## Development Environment
- Vue 3 framework with Composition API
- Vite as build tool and development server
- Node.js environment
- Firebase development tools
- PWA development capabilities

## Key Dependencies
1. Core Framework
   - Vue 3: Frontend framework for educational app
   - Vite: Build tool and dev server
   - Vite Plugin PWA: Progressive Web App support for offline classroom use

2. UI & Styling
   - TailwindCSS: Utility-first CSS framework
   - ShadCN Vue: UI component library
   - Radix Icons Vue: Icon system
   - PostCSS: CSS processing

3. State & Routing
   - Pinia: State management
   - Vue Router: Client-side routing

4. Storage & Sync
   - IndexedDB: Hierarchical data storage
     * Grade levels collection
     * Subjects collection
     * Classes collection
     * Class records collection
   - Dexie.js: IndexedDB wrapper (optional)
     * Improved querying of nested data
     * Relationship handling
   - Firebase SDK:
     * Firestore: Educational data storage
     * Storage: Educational resource storage
     * Authentication: Teacher account management

5. PWA Features
   - Service Workers: Offline support
   - Web App Manifest: Installation support
   - Background Sync: Data synchronization

## Configuration Files
1. `vite.config.js`
   - Vite build configuration
   - Plugin setup
   - Development server settings

2. `tailwind.config.js`
   - TailwindCSS customization
   - Theme configuration
   - Plugin settings

3. `postcss.config.js`
   - PostCSS plugin configuration
   - CSS processing setup

4. `components.json`
   - Component library configuration
   - UI component settings

5. `jsconfig.json`
   - JavaScript configuration
   - Path aliases
   - Compiler options

## Project Structure
```
src/
├── App.vue           # Root component
├── main.js           # Application entry point
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── icons/       # Icon components
│   ├── ui/          # UI components
│   ├── grades/      # Grade level components
│   ├── subjects/    # Subject components
│   ├── classes/     # Class components
│   └── records/     # Class record components
├── lib/             # Utility functions
├── router/          # Route definitions
├── stores/          # Hierarchical state management
│   ├── grades.js    # Grade levels store
│   ├── subjects.js  # Subjects store
│   ├── classes.js   # Classes store
│   └── records.js   # Class records store
└── views/           # Page components
    ├── grades/      # Grade level views
    ├── subjects/    # Subject views
    ├── classes/     # Class views
    └── records/     # Record views
```

## Build & Development
- Development server: `npm run dev`
- Production build: `npm run build`
- Local preview: `npm run preview`

## Technical Constraints
- Browser compatibility:
  - Modern browsers with Service Worker support
  - IndexedDB support required
  - PWA installation capabilities
- Node.js version requirements
- Build tool dependencies
- Firebase project setup and configuration
- Secure origin (HTTPS) for PWA features

## Development Practices
1. Code Organization
   - Hierarchical component architecture
   - Educational data-focused structure
   - Clear separation of data levels
   - Nested routing patterns

2. File Naming Conventions
   - PascalCase for components
   - camelCase for utility files
   - kebab-case for assets
   - Consistent naming across levels

3. Development Workflow
   - Local development using Vite dev server
   - Hot module replacement enabled
   - Component hot reloading
