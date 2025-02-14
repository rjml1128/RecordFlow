# RecordFlow - Offline-First Educational Records System

## Overview
RecordFlow is a Progressive Web Application (PWA) designed for managing educational records with offline-first capabilities. It follows a GitHub Desktop-like approach for data synchronization and provides a seamless experience across devices.

## Core Features

### 1. Offline-First Architecture
- Local-first data storage using Dexie.js (IndexedDB)
- Commit-based changes tracking
- Background sync when online
- Conflict resolution handling

### 2. Authentication System
- Initial online authentication required
- Support for Google Sign-in and traditional authentication
- Universal 24-hour authentication expiry (online and offline)
- 6-hour warning window for token refresh
- Automatic token refresh for online users
- Manual reconnection requirement for offline users
- Encrypted local credential storage
- Consistent security policy across all users

### 3. Data Synchronization
Similar to GitHub Desktop's workflow:
- Local changes are tracked and "staged"
- Users can commit changes locally
- Push commits to cloud when online
- Pull remote changes when needed
- Conflict resolution UI for merge conflicts

#### Automatic Synchronization
- Configurable auto-commit feature:
  * Enable/disable auto-commits
  * Set commit interval (e.g., every 5 minutes)
  * Automatic grouping of related changes
  * Local commit history tracking

- Configurable auto-push feature:
  * Enable/disable auto-push
  * Set push interval (e.g., every 15 minutes)
  * Only active when online
  * Automatic conflict detection and handling

- User Preferences:
  * Auto-commit settings persistence
  * Auto-push settings persistence
  * Notification preferences
  * Sync status indicators

### 4. PWA Features
- Installable on desktop and mobile
- Offline functionality
- Push notifications for sync status
- Automatic updates
- Cross-platform compatibility

## Technical Architecture

### 1. Database Structure (Dexie.js)
```javascript
// Database Schema
{
  gradeLevels: '++id, name, createdAt, updatedAt, syncStatus',
  changes: '++id, timestamp, type, entityId, syncStatus',
  syncMeta: 'id, lastSync, status',
  auth: 'id, tokens, expiry'
}
```

### 2. Authentication Flow
```
1. Initial Login (Online)
   └─ Google Sign-in/Traditional Auth
      └─ Store encrypted credentials
         └─ Enable offline access

2. Subsequent Access
   ├─ Online: Verify with Firebase
   └─ Offline: Check local credentials
      └─ Verify expiry (24h limit)
```

### 3. Sync Mechanism
```
Local Changes
    │
    ▼
Stage Changes
    │
    ▼
Local Commit
    │
    ▼
Push to Cloud (When Online)
    │
    ▼
Handle Conflicts
```

### 4. File Structure
```
src/
├── components/
│   ├── auth/
│   ├── sync/
│   └── ui/
├── composables/
│   ├── useAuth.js
│   ├── useDatabase.js
│   └── useSync.js
├── lib/
│   ├── db/
│   │   ├── index.js
│   │   └── migrations.js
│   ├── sync/
│   │   ├── changes.js
│   │   └── conflicts.js
│   └── auth/
│       ├── online.js
│       └── offline.js
└── stores/
    ├── auth.js
    └── sync.js
```

## Implementation Guidelines

### 1. Local Database Setup
```javascript
import Dexie from 'dexie';

class RecordFlowDB extends Dexie {
  constructor() {
    super('RecordFlow');
    
    this.version(1).stores({
      gradeLevels: '++id, name, createdAt, updatedAt, syncStatus',
      changes: '++id, timestamp, type, entityId, syncStatus',
      syncMeta: 'id, lastSync, status',
      auth: 'id, tokens, expiry'
    });

    // Add hooks for sync tracking
    this.gradeLevels.hook('creating', (key, obj) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
      obj.syncStatus = 'pending';
    });
  }
}
```

### 2. Auth Integration
```javascript
// Offline auth check
async function checkOfflineAuth() {
  const auth = await db.auth.get(1);
  if (!auth) return false;
  
  const now = new Date();
  const expiry = new Date(auth.expiry);
  
  return expiry > now;
}

// Auth storage
async function storeAuthCredentials(tokens) {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  
  await db.auth.put({
    id: 1,
    tokens,
    expiry
  });
}
```

### 3. Sync Management

#### Basic Operations
```javascript
async function trackChange(type, entityId, data) {
  await db.changes.add({
    timestamp: new Date(),
    type,
    entityId,
    data,
    syncStatus: 'pending'
  });
}

async function pushChanges() {
  const changes = await db.changes
    .where('syncStatus')
    .equals('pending')
    .toArray();
    
  // Push to cloud
  for (const change of changes) {
    try {
      await syncToCloud(change);
      await db.changes.update(change.id, {
        syncStatus: 'synced'
      });
    } catch (error) {
      // Handle sync error
    }
  }
}
```

#### Auto-Sync Implementation
```javascript
class AutoSyncManager {
  constructor(config = {
    autoCommit: { enabled: true, interval: 5 * 60 * 1000 },
    autoPush: { enabled: true, interval: 15 * 60 * 1000 }
  }) {
    this.config = config;
    this.setupAutoSync();
  }

  setupAutoSync() {
    if (this.config.autoCommit.enabled) {
      setInterval(() => this.performAutoCommit(),
        this.config.autoCommit.interval);
    }

    if (this.config.autoPush.enabled) {
      setInterval(() => this.performAutoPush(),
        this.config.autoPush.interval);
    }
  }

  async performAutoCommit() {
    const changes = await db.changes
      .where('status')
      .equals('pending')
      .toArray();

    if (changes.length > 0) {
      const commit = {
        timestamp: new Date(),
        changes: this.groupRelatedChanges(changes),
        status: 'unpushed'
      };

      await db.transaction('rw', [db.changes, db.commits], async () => {
        await db.commits.add(commit);
        await db.changes.where('status').equals('pending')
          .modify({ status: 'committed' });
      });
    }
  }

  async performAutoPush() {
    if (!navigator.onLine) return;

    const unpushedCommits = await db.commits
      .where('status')
      .equals('unpushed')
      .toArray();

    for (const commit of unpushedCommits) {
      try {
        await this.pushToCloud(commit);
        await db.commits.update(commit.id, {
          status: 'pushed',
          syncedAt: new Date()
        });
      } catch (error) {
        console.error('Auto-push failed:', error);
      }
    }
  }
}
```

#### Enhanced Auth Management
```javascript
class AuthManager {
  static AUTH_CONFIG = {
    expiryTime: 24 * 60 * 60 * 1000,    // 24 hours for all users
    warningWindow: 6 * 60 * 60 * 1000,  // 6-hour warning
    checkInterval: 15 * 60 * 1000       // Check every 15 minutes
  };

  async checkAuthStatus() {
    const auth = await db.auth.get(1);
    if (!auth) return { status: 'no-auth' };

    const now = new Date();
    const expiry = new Date(auth.expiry);
    
    if (expiry <= now) {
      return { status: 'expired' };
    }

    // Check warning window
    const warningTime = new Date(expiry - AuthManager.AUTH_CONFIG.warningWindow);
    if (now >= warningTime) {
      if (navigator.onLine) {
        await this.refreshToken();
      } else {
        return {
          status: 'warning',
          message: 'Authentication will expire soon. Please connect to refresh.'
        };
      }
    }

    return { status: 'valid' };
  }
}
```

## Best Practices

1. Data Management
   - Always work with local data first
   - Track all changes for sync
   - Handle conflicts gracefully
   - Regular cleanup of old change logs

2. Authentication
   - Secure storage of credentials
   - Clear auth data on logout
   - Show clear auth status
   - Warn before expiry

3. Offline Support
   - Clear offline indicators
   - Background sync when possible
   - Data validation locally
   - Conflict resolution UI

4. Performance
   - Efficient indexing
   - Batch operations
   - Lazy loading
   - Resource caching

## Development Workflow

1. Setup
   ```bash
   npm install
   npm install dexie
   ```

2. Development
   ```bash
   npm run dev
   ```

3. Building
   ```bash
   npm run build
   ```

4. Testing Offline
   - Use Chrome DevTools
   - Toggle offline mode
   - Test sync scenarios
   - Verify data persistence

## Deployment Considerations

1. PWA Requirements
   - HTTPS required
   - Service worker setup
   - Manifest configuration
   - Icons and assets

2. Database
   - IndexedDB storage limits
   - Data cleanup strategies
   - Migration handling

3. Authentication
   - Firebase configuration
   - OAuth setup
   - Security rules

4. Performance
   - Caching strategies
   - Bundle optimization
   - Lazy loading

## Future Considerations

1. Extended Offline Support
   - Longer offline periods
   - Enhanced conflict resolution
   - Batch sync operations

2. Enhanced Security
   - End-to-end encryption
   - Secure credential storage
   - Audit logging

3. Performance Optimization
   - Advanced caching
   - Background sync
   - Compression

4. Additional Features
   - Multi-device sync
   - Collaborative editing
   - Version history
