import Dexie from 'dexie';

export class RecordFlowDB extends Dexie {
  constructor() {
    super('RecordFlowDB');
    
    // Define tables and their primary keys and indexes
    this.version(1).stores({
      records: '++id, title, date, userId', // Primary key is id (autoincrementing), indexes on title, date, and userId
      settings: 'id, value', // Primary key is id, index on value
      // Add more tables as needed
    });
  }
}

// Create a single instance
export const db = new RecordFlowDB();

// Export commonly used operations
export const dbOperations = {
  async addRecord(data) {
    return await db.records.add(data);
  },
  
  async getRecord(id) {
    return await db.records.get(id);
  },
  
  async updateRecord(id, data) {
    return await db.records.update(id, data);
  },
  
  async deleteRecord(id) {
    return await db.records.delete(id);
  },
  
  async getAllRecords() {
    return await db.records.toArray();
  },
  
  async getSetting(id) {
    return await db.settings.get(id);
  },
  
  async setSetting(id, value) {
    return await db.settings.put({ id, value });
  }
};