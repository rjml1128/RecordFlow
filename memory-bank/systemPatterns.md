# System Patterns

## Architecture Overview
The application follows a modern Progressive Web App architecture built with Vue.js, designed specifically for educational record management with nested data structures and offline capabilities:

### Data Architecture
```
Grade Levels
└── Subjects
    └── Classes
        └── Class Records
```

This hierarchical structure is reflected throughout the application's components, routing, and storage patterns.

### Component Architecture
- Organized in a hierarchical structure under `src/components/`
- UI components using ShadCN Vue in `src/components/ui/`
- Icon system using Radix Icons Vue in `src/components/icons/`
- Component composition using Vue 3's Composition API

### Routing System
- Vue Router integration in `src/router/`
- Route-based code splitting for optimal loading
- Views directory (`src/views/`) for page components

### State Management & Storage
1. Educational Data State
   - Hierarchical Pinia stores following data structure
   - Nested state management patterns
   - Efficient data access patterns for each level
   - Cache management for frequently accessed data

2. Storage Architecture
   - Structured IndexedDB stores for nested data
   - Efficient querying of hierarchical data
   - Optional Dexie.js for improved IndexedDB operations
   - Firestore collections matching data hierarchy
   - Background sync with conflict resolution
   - Data version tracking for sync

3. Authentication Flow
   - Teacher-focused Firebase Authentication
   - Simple Google/Email sign-in
   - Personal data isolation
   - Offline authentication state management

### Asset Management
- Static assets organized in `src/assets/`
- CSS utilities in `src/assets/main.css`
- SVG assets for icons and logos

## Design Patterns
1. Component Patterns
   - Hierarchical component organization
   - Level-specific components (Grade, Subject, Class, Record)
   - Nested navigation components
   - Data drill-down patterns

2. UI Component Library
   - ShadCN Vue component system
   - Educational data display patterns
   - Hierarchical navigation components
   - Quick-access patterns for teachers
   - Offline state indicators

3. PWA Patterns
   - Classroom-optimized offline support
   - Efficient data caching strategy
   - Background sync queue
   - Cache-then-network for educational data
   - Quick data entry patterns

3. File Organization
   - Feature-based directory structure
   - Clear separation of concerns
   - Index files for clean exports

## Technical Decisions
1. Data Organization
   - Normalized data structure for nested relationships
   - Efficient indexing for quick access
   - Optimized queries for educational data
   - Caching strategies for frequent access patterns

2. Storage Strategy
   - IndexedDB schema for educational data
   - Firestore collections for cloud storage
   - Optimistic UI updates for classroom usage
   - Teacher-specific data partitioning

3. Code Standards
   - ESM modules for imports/exports
   - Vue 3 recommended practices
   - Component composability
   - PWA best practices
