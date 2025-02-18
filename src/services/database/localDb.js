import Dexie from 'dexie';

export class RecordFlowDB extends Dexie {
  constructor() {
    super('RecordFlowDB');
    
    // Define tables and their primary keys and indexes
    this.version(2).stores({  // Increment version number
      records: '++id, title, date, userId', // Primary key is id (autoincrementing), indexes on title, date, and userId
      settings: 'id, value', // Primary key is id, index on value
      gradeLevels: '++id, name, createdAt, updatedAt, syncStatus', // As per project brief
      auth: 'id, tokens, expiry', // New auth table
      // Add more tables as needed
    });
  }
}

// Create a single instance
export const localDb = new RecordFlowDB();

// Export commonly used operations
export const dbOperations = {
  async addRecord(data) {
    return await localDb.records.add(data);
  },
  
  async getRecord(id) {
    return await localDb.records.get(id);
  },
  
  async updateRecord(id, data) {
    return await localDb.records.update(id, data);
  },
  
  async deleteRecord(id) {
    return await localDb.records.delete(id);
  },
  
  async getAllRecords() {
    return await localDb.records.toArray();
  },
  
  async getSetting(id) {
    return await localDb.settings.get(id);
  },
  
  async setSetting(id, value) {
    return await localDb.settings.put({ id, value });
  },

  // Add auth operations
  async getAuth() {
    return await localDb.auth.get(1);
  },

  async setAuth(tokens, expiry) {
    return await localDb.auth.put({
      id: 1,
      tokens,
      expiry
    });
  },

  async clearAuth() {
    return await localDb.auth.delete(1);
  },

  // Grade Level operations
  async addGradeLevel(name) {
    return await localDb.gradeLevels.add({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending'
    });
  },

  async getGradeLevel(id) {
    return await localDb.gradeLevels.get(id);
  },

  async getAllGradeLevels() {
    return await localDb.gradeLevels.toArray();
  },

  async updateGradeLevel(id, name) {
    return await localDb.gradeLevels.update(id, {
      name,
      updatedAt: new Date(),
      syncStatus: 'pending'
    });
  },

  async deleteGradeLevel(id) {
    return await localDb.gradeLevels.delete(id);
  },

  async getGradeLevelByName(name) {
    return await localDb.gradeLevels
      .where('name')
      .equals(name)
      .first();
  },

  async updateGradeLevelSyncStatus(id, status) {
    return await localDb.gradeLevels.update(id, {
      syncStatus: status,
      updatedAt: new Date()
    });
  }
};