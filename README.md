# RecordFlow

A modern record-keeping application for educators with offline-first capabilities.

## Features

- Authentication with email/password and Google Sign-in
- Offline-first data management
- Real-time synchronization
- Hierarchical data structure for:
  - Grade Levels
  - Subjects
  - Classes
  - Records
- Modern UI with Tailwind CSS

## Tech Stack

- Vue.js 3
- Firebase (Authentication, Firestore, Realtime Database)
- Tailwind CSS
- Vite
- IndexedDB for offline storage

## Setup

1. Clone the repository
```bash
git clone https://github.com/rjml1128/recordflow.git
cd recordflow
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your Firebase configuration
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Vue components
├── composables/     # Vue composables
├── lib/            # Utilities and configurations
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
└── views/          # Vue views/pages
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
