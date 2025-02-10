import { db as firebaseDb, rtdb, auth } from './firebase';
import { db as localDb, dbOperations } from './db';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { ref, set, get, child, update } from 'firebase/database';

class DataService {
  constructor() {
    this.syncInProgress = false;
    this.setupSync();
  }

  // Set up real-time sync
  setupSync() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.startSync(user.uid);
      }
    });
  }

  // Start real-time sync with both Firestore and RTDB
  startSync(userId) {
    // Firestore sync
    const recordsRef = collection(firebaseDb, 'records');
    onSnapshot(recordsRef, snapshot => {
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
    });
  }

  // Add record with offline support and dual database sync
  async addRecord(data) {
    try {
      // Add to local DB first
      const localId = await dbOperations.addRecord(data);
      
      if (navigator.onLine && auth.currentUser) {
        this.syncInProgress = true;
        // Add to Firestore
        const docRef = await addDoc(collection(firebaseDb, 'records'), {
          ...data,
          userId: auth.currentUser.uid,
          createdAt: new Date()
        });

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
      
      if (navigator.onLine && auth.currentUser) {
        this.syncInProgress = true;
        const record = await localDb.records.get(id);
        if (record?.firebaseId) {
          // Update Firestore
          await updateDoc(doc(firebaseDb, 'records', record.firebaseId), {
            ...data,
            updatedAt: new Date()
          });

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
      
      if (navigator.onLine && auth.currentUser && record?.firebaseId) {
        this.syncInProgress = true;
        // Delete from Firestore
        await deleteDoc(doc(firebaseDb, 'records', record.firebaseId));
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
      if (navigator.onLine && auth.currentUser) {
        this.syncInProgress = true;
        
        // Get Firestore records
        const snapshot = await getDocs(collection(firebaseDb, 'records'));
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