# The Wallpost

A minimal, anonymous message wall built with React and Firebase. Post a message under a nickname, browse what others have posted in real time order, and delete your own posts — all backed by Firestore with security rules enforced server-side.

## Features

- **Post & browse** — Leave a nickname and a message on a shared public wall.
- **Anonymous authentication** — Every visitor is signed in transparently via Firebase Anonymous Auth, so posts can be tied to an author without requiring signup.
- **Author-only delete** — Only the person who created a post can delete it (enforced both in the UI and in Firestore security rules), with a confirmation prompt before deleting.
- **Optimistic UI** — New posts appear instantly while the write completes in the background, and roll back automatically if it fails.
- **Pagination** — Posts load in pages with a "Load more" control instead of fetching the entire collection at once.
- **Input validation** — Nicknames and messages are trimmed and length-limited before being submitted.
- **Responsive layout** — Usable on both desktop and mobile viewports.
- **Loading & error states** — Network/Firestore failures surface a message instead of failing silently.

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | [React 18](https://react.dev/) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Backend / data | [Firebase](https://firebase.google.com/) — Firestore + Anonymous Authentication |
| Hosting | Firebase Hosting |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) |
| Linting | ESLint |
| CI/CD | GitHub Actions |

## Project Structure

```text
src/
├── components/       # Presentational components (form, list, item, empty state)
├── hooks/            # useAuth (anonymous sign-in) and usePosts (Firestore data layer)
├── utils/            # Small shared helpers (timestamp formatting)
├── firebase-config.js
├── App.jsx
└── main.jsx
firestore.rules        # Server-side security rules for the `post` collection
firebase.json           # Firebase Hosting + Firestore rules deployment config
.github/workflows/      # CI (lint/test/build) and Firebase Hosting deploy pipelines
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Firebase](https://console.firebase.google.com/) project with **Firestore** and **Anonymous Authentication** enabled

### Installation

```bash
git clone git@github.com:randol696/the-wallpost.git
cd the-wallpost
npm install
```

### Configuration

Copy the example environment file and fill it in with your Firebase project's web app config (found in Firebase Console → Project Settings → General → Your apps):

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

`.env` is gitignored and should never be committed.

### Running locally

```bash
npm run dev
```

The app will be available at the URL Vite prints (typically `http://localhost:5173`).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot module reload |
| `npm run build` | Build an optimized production bundle into `dist/` |
| `npm run preview` | Serve the production build locally for a final check |
| `npm run lint` | Run ESLint across the project |
| `npm run test` | Run the Vitest test suite |

## Data Model

Posts live in a single Firestore collection, `post`:

| Field | Type | Description |
| --- | --- | --- |
| `user` | `string` | Display nickname (1–40 characters) |
| `message` | `string` | Post content (1–500 characters) |
| `uid` | `string` | Firebase Auth UID of the author (used to authorize deletes) |
| `createdAt` | `Timestamp` | Server-generated creation time, used for ordering and pagination |

## Security

Firestore access is governed by [`firestore.rules`](firestore.rules):

- **Read** — open to everyone (it's a public wall).
- **Create** — requires authentication and validates that `uid` matches the signed-in user, `user`/`message` are non-empty strings within their length limits, and `createdAt` is the server timestamp.
- **Update** — disabled entirely; posts are immutable once created.
- **Delete** — only permitted when the requester's `uid` matches the post's `uid`.

Deploy rule changes with:

```bash
firebase deploy --only firestore:rules
```

## Deployment

The app deploys to **Firebase Hosting**. A GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds and deploys automatically on every push to `main`, once the following repository secrets are configured:

| Secret | Purpose |
| --- | --- |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID` | Baked into the production build at build time |
| `FIREBASE_SERVICE_ACCOUNT_THE_WALL_APP_86171` | Firebase service account used by `FirebaseExtended/action-hosting-deploy` to publish the build |

To deploy manually instead:

```bash
npm run build
firebase deploy --only hosting
```

## Continuous Integration

Every push and pull request against `main` runs through [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which installs dependencies and runs lint, tests, and a production build.

## Contributing

1. Create a branch off `main`.
2. Make your changes, adding or updating tests where relevant.
3. Ensure `npm run lint`, `npm run test`, and `npm run build` all pass.
4. Open a pull request describing the change.

## License

No license has been specified for this project yet. All rights reserved by the repository owner unless a license is added.
