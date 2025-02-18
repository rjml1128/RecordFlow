import Dexie from 'dexie';

export class RecordFlowDB extends Dexie {
  constructor() {
    super('RecordFlowDB');
    
    // Define tables and their primary keys and indexes
    this.version(2).stores({  // Increment version number
      records: '++id, title, date, userId', // Primary key is id (autoincrementing), indexes on title, date, and userId
      settings: 'id, value', // Primary key is id, index on value
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
  }
};