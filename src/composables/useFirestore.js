import { ref } from 'vue'
import { 
  doc, 
  collection,
  query,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  orderBy 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { dataService } from '@/lib/dataService'
import { useAuthStore } from '@/stores/auth'

export function useFirestore() {
  const loading = ref(false)
  const error = ref('')
  const authStore = useAuthStore()

  const getUserDocRef = (userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    return doc(db, 'users', userId)
  }

  const getGradeLevelDocRef = (gradeLevelId, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    return doc(db, 'users', userId, 'gradeLevels', gradeLevelId)
  }

  const getSubjectDocRef = (gradeLevelId, subjectId, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    return doc(db, 'users', userId, 'gradeLevels', gradeLevelId, 'subjects', subjectId)
  }

  const getClassDocRef = (gradeLevelId, subjectId, classId, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    return doc(db, 'users', userId, 'gradeLevels', gradeLevelId, 'subjects', subjectId, 'classes', classId)
  }

  const getRecordDocRef = (gradeLevelId, subjectId, classId, recordId, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    return doc(db, 'users', userId, 'gradeLevels', gradeLevelId, 'subjects', subjectId, 'classes', classId, 'records', recordId)
  }

  // User Profile Operations
  const getUserProfile = async (userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const docRef = getUserDocRef(userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? docSnap.data() : null
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateUserProfile = async (data, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const docRef = getUserDocRef(userId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      })
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Grade Level Operations
  const getGradeLevels = async (userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const colRef = collection(db, 'users', userId, 'gradeLevels')
      const q = query(colRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const createGradeLevel = async (data, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const colRef = collection(db, 'users', userId, 'gradeLevels')
      const docRef = doc(colRef)
      await setDoc(docRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return docRef.id
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Subject Operations
  const getSubjects = async (gradeLevelId, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const colRef = collection(db, 'users', userId, 'gradeLevels', gradeLevelId, 'subjects')
      const q = query(colRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const createSubject = async (gradeLevelId, data, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const colRef = collection(db, 'users', userId, 'gradeLevels', gradeLevelId, 'subjects')
      const docRef = doc(colRef)
      await setDoc(docRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return docRef.id
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Class Operations
  const getClasses = async (gradeLevelId, subjectId, userId = authStore.user?.uid) => {
    if (!userId) throw new Error('User ID is required')
    
    loading.value = true
    error.value = ''
    
    try {
      const colRef = collection(
        db, 
        'users', 
        userId, 
        'gradeLevels', 
        gradeLevelId, 
        'subjects', 
        subjectId, 
        'classes'
      )
      const q = query(colRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Record Operations with offline support
  const getRecords = async (gradeLevelId, subjectId, classId, userId = authStore.user?.uid) => {
    loading.value = true
    error.value = ''
    
    try {
      // Use dataService for offline-capable record fetching
      return await dataService.getAllRecords()
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const createRecord = async (gradeLevelId, subjectId, classId, data, userId = authStore.user?.uid) => {
    loading.value = true
    error.value = ''
    
    try {
      // Use dataService for offline-capable record creation
      const recordData = {
        ...data,
        gradeLevelId,
        subjectId,
        classId,
        userId,
        path: `users/${userId}/gradeLevels/${gradeLevelId}/subjects/${subjectId}/classes/${classId}/records`
      }
      return await dataService.addRecord(recordData)
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateRecord = async (gradeLevelId, subjectId, classId, recordId, data, userId = authStore.user?.uid) => {
    loading.value = true
    error.value = ''
    
    try {
      // Use dataService for offline-capable record updates
      return await dataService.updateRecord(recordId, {
        ...data,
        updatedAt: new Date().toISOString()
      })
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteRecord = async (recordId) => {
    loading.value = true
    error.value = ''
    
    try {
      // Use dataService for offline-capable record deletion
      await dataService.deleteRecord(recordId)
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    // User Profile
    getUserProfile,
    updateUserProfile,
    // Grade Levels
    getGradeLevels,
    createGradeLevel,
    // Subjects
    getSubjects,
    createSubject,
    // Classes
    getClasses,
    // Records with offline support
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    // Doc References
    getUserDocRef,
    getGradeLevelDocRef,
    getSubjectDocRef,
    getClassDocRef,
    getRecordDocRef
  }
}