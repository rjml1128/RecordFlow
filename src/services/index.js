import { db, dbOperations } from './database/db'
import { auth } from './core/firebase'
import { dataService } from './database/useDataService'

export const createServices = () => {
  return {
    install: (app) => {
      // Create services object with all services
      const services = {
        db,
        dbOperations,
        dataService,
        auth
      }

      // Provide services to components via inject
      app.provide('services', services)

      // For backwards compatibility and easier access in non-component code
      if (typeof window !== 'undefined') {
        window.$db = db
        window.$dbOps = dbOperations
        window.$dataService = dataService
        window.$auth = auth
      }
    }
  }
}