import { db as firebaseDb, rtdb, auth } from './firebase';
import { db as localDb, dbOperations } from './db';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { ref, set, get, child, update } from 'firebase/database';

class DataService {
  constructor() {
    this.syncInProgress = false;
    this.unsubscribe = null;
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2 seconds
    
    // Delay setup to ensure auth is ready
    setTimeout(() => {
      this.setupSync();
    }, 1000);
  }

  // Check if we have permission to access a path
  async checkPermissions(userId) {
    if (!userId || !auth.currentUser) return false;
    
    try {
      // Try to read the user document first
      const userDocRef = doc(firebaseDb, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      
      // If we can read the user doc, we likely have proper permissions
      return userDoc.exists();
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  // Set up real-time sync
  setupSync() {
    // Wait for Firebase Auth to be ready
    const unsubscribe = auth.onAuthStateChanged(async user => {
      // Clean up any existing listener
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      
      // Reset retry attempts
      this.retryAttempts = 0;
      
      try {
        // Only start sync if we have a logged-in user
        if (user?.uid) {
          console.log('Checking permissions for user:', user.uid);
          // Check permissions before starting sync
          const hasPermission = await this.checkPermissions(user.uid);
          if (hasPermission) {
            console.log('User has required permissions, starting sync');
            await this.startSync(user.uid);
          } else {
            console.error('User does not have required permissions');
          }
        } else {
          console.log('No authenticated user, skipping sync');
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      }
    });

    // Store the auth state listener to clean it up later if needed
    this.authUnsubscribe = unsubscribe;
  }

  // Check if we can connect to Firebase
  async checkConnection(userId) {
    if (!userId || !auth.currentUser) return false;
    
    try {
      // Try to read the user's own document since we know we have permission for it
      const userRef = doc(firebaseDb, `users/${userId}`);
      await getDoc(userRef);
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  // Start real-time sync with both Firestore and RTDB
  async startSync(userId) {
    if (!userId || !auth.currentUser || this.unsubscribe) return;

    // Check if we can connect to Firebase with the user's document
    const canConnect = await this.checkConnection(userId);
    if (!canConnect) {
      console.error('Cannot establish connection to Firebase');
      return;
    }

    try {
      // Double check auth state
      if (userId !== auth.currentUser.uid) {
        console.error('User ID mismatch');
        return;
      }

      // Initialize user document structure
      const userDocRef = doc(firebaseDb, `users/${userId}`);
      const recordsCollectionRef = collection(firebaseDb, `users/${userId}/records`);
      
      // Create initial structure if it doesn't exist
      await setDoc(userDocRef, {
        uid: userId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });

      console.log('User document structure initialized');

      // Firestore sync with correct path structure
      const recordsRef = recordsCollectionRef;
      
      console.log('Starting Firestore sync');
      
      this.unsubscribe = onSnapshot(recordsRef, {
        next: (snapshot) => {
          if (this.syncInProgress) return;
          
          snapshot.docChanges().forEach(async change => {
            const data = { id: change.doc.id, ...change.doc.data() };
            
            if (change.type === 'added' || change.type === 'modified') {
              await localDb.records.put(data);
              // Sync to RTDB
              await set(ref(rtdb, `users/${userId}/records/${data.id}`), data);
            } else if (change.type === 'removed') {
              await localDb.records.delete(data.id);
              // Remove from RTDB
              await set(ref(rtdb, `users/${userId}/records/${data.id}`), null);
            }
          });

          // Reset retry attempts on successful sync
          this.retryAttempts = 0;
        },
        error: async (error) => {
          console.error('Firestore sync error:', error);
          
          // Clean up current listener
          if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
          }

          // Retry logic for temporary errors
          if (this.retryAttempts < this.maxRetries) {
            this.retryAttempts++;
            console.log(`Retrying sync (attempt ${this.retryAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            this.startSync(userId);
          }
        }
      });

      console.log('Firestore sync initialized successfully');
      
    } catch (error) {
      console.error('Error starting sync:', error);
      
      // Retry logic for startup errors
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++;
        console.log(`Retrying sync (attempt ${this.retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        await this.startSync(userId);
      }
    }
  }

  // Cleanup function
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
      this.authUnsubscribe = null;
    }
  }

  // Add record with offline support and dual database sync
  async addRecord(data) {
    try {
      // Add to local DB first
      const localId = await dbOperations.addRecord(data);
      
      if (navigator.onLine && auth.currentUser?.uid) {
        this.syncInProgress = true;
        const docRef = await addDoc(
          collection(firebaseDb, `users/${auth.currentUser.uid}/records`),
          {
            ...data,
            userId: auth.currentUser.uid,
            createdAt: new Date()
          }
        );

        // Add to Realtime Database
        await set(ref(rtdb, `users/${auth.currentUser.uid}/records/${docRef.id}`), {
          ...data,
          id: docRef.id,
          userId: auth.currentUser.uid,
          createdAt: new Date().toISOString()
        });

        // Update local record with Firebase ID
        await localDb.records.update(localId, { firebaseId: docRef.id });
        this.syncInProgress = false;
      }
      
      return localId;
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  }

  // Update record with offline support and dual database sync
  async updateRecord(id, data) {
    try {
      // Update local DB first
      await dbOperations.updateRecord(id, data);
      
      if (navigator.onLine && auth.currentUser?.uid) {
        this.syncInProgress = true;
        const record = await localDb.records.get(id);
        if (record?.firebaseId) {
          // Update Firestore
          await updateDoc(
            doc(firebaseDb, `users/${auth.currentUser.uid}/records`, record.firebaseId),
            {
              ...data,
              updatedAt: new Date()
            }
          );

          // Update Realtime Database
          await update(ref(rtdb, `users/${auth.currentUser.uid}/records/${record.firebaseId}`), {
            ...data,
            updatedAt: new Date().toISOString()
          });
        }
        this.syncInProgress = false;
      }
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }

  // Delete record with offline support and dual database sync
  async deleteRecord(id) {
    try {
      const record = await localDb.records.get(id);
      await dbOperations.deleteRecord(id);
      
      if (navigator.onLine && auth.currentUser?.uid && record?.firebaseId) {
        this.syncInProgress = true;
        // Delete from Firestore
        await deleteDoc(
          doc(firebaseDb, `users/${auth.currentUser.uid}/records`, record.firebaseId)
        );
        // Delete from Realtime Database
        await set(ref(rtdb, `users/${auth.currentUser.uid}/records/${record.firebaseId}`), null);
        this.syncInProgress = false;
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  // Get all records from both databases
  async getAllRecords() {
    try {
      // Get local records first
      const localRecords = await dbOperations.getAllRecords();
      
      // If online, sync with Firebase
      if (navigator.onLine && auth.currentUser?.uid) {
        this.syncInProgress = true;
        
        // Get Firestore records
        const snapshot = await getDocs(
          collection(firebaseDb, `users/${auth.currentUser.uid}/records`)
        );
        const firestoreRecords = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Get Realtime Database records
        const rtdbSnapshot = await get(ref(rtdb, `users/${auth.currentUser.uid}/records`));
        const rtdbRecords = rtdbSnapshot.val() || {};
        
        // Merge all records
        const allRecords = [...firestoreRecords];
        Object.values(rtdbRecords).forEach(record => {
          if (!allRecords.find(r => r.id === record.id)) {
            allRecords.push(record);
          }
        });
        
        // Update local database
        await Promise.all(allRecords.map(record => 
          localDb.records.put(record)
        ));
        
        this.syncInProgress = false;
        return await dbOperations.getAllRecords();
      }
      
      return localRecords;
    } catch (error) {
      console.error('Error getting records:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();