# The Wallpost — Things That Can Change

A review of the current codebase (React + Vite + Firebase Firestore "message wall" app) and a punch-list of things worth changing, grouped by priority.

## Security

- **Firestore has no access rules / auth.** [App.jsx](src/App.jsx) calls `addDoc`, `getDocs`, and `deleteDoc` directly against the `post` collection with no authentication. Anyone with the API key can read, write, or delete every post from a browser console or script. Check the Firestore security rules in the Firebase console — if they're in test/open mode, this is publicly writable/deletable data.
- **Anyone can delete anyone else's post.** The delete button ([App.jsx:41](src/App.jsx#L41)) has no ownership check and no confirmation dialog — one click permanently removes another user's message.
- **No input validation or length limits.** `user` and `message` ([App.jsx:9-10](src/App.jsx#L9-L10)) are posted as-is — no trimming, no max length, no profanity/spam filtering. A blank nickname or an empty message can be submitted.
- **Firebase config is hardcoded and committed** ([firebase-config.js](src/firebase-config.js)). Firebase web API keys aren't secret by design (security is enforced via Firestore rules, not key secrecy), but it's still worth moving to environment variables (`import.meta.env.VITE_*`) so config isn't hand-edited in source and differs cleanly between environments.

## Bugs / Correctness

- **`package.json` name mismatch**: `"name": "the-wall"` ([package.json:2](package.json#L2)) vs. the repo/app name "the-wallpost" — cosmetic but confusing.
- **`src/index.css` is empty** — either remove the import in [main.jsx](src/main.jsx) or use it; an empty stylesheet import is dead weight.
- **Duplicate `index.html`**: one at the project root (used by Vite) and another under [public/index.html](public/index.html) that Vite ignores. The one in `public/` is misleading dead code.
- **No loading or error states.** `getPost`, `postMessage`, `deletePost` ([App.jsx:14-30](src/App.jsx#L14-L30)) don't handle network failures — a failed Firestore call just fails silently with no user feedback.

## Dependency Cleanup

The app only uses plain CSS, yet `package.json` pulls in four separate styling systems:
- `@mui/material`, `@mui/styled-engine-sc` — not imported anywhere in `src/`
- `bootstrap`, `react-bootstrap` — not imported anywhere in `src/`
- `styled-components`, `@emotion/react`, `@emotion/styled` — not imported anywhere in `src/`
- `tailwindcss` — configured ([tailwind.config.js](tailwind.config.js)) but `content: []` is empty, so it generates no utility classes and isn't wired into any CSS file via `@tailwind` directives

Picking one styling approach (or keeping plain CSS as-is) and removing the other three would shrink `node_modules` and `package-lock.json` significantly and remove confusion for future contributors.

## UX / Features (nice-to-haves)

- **No timestamps** on posts — can't tell when a message was posted or sort by recency.
- **No pagination/limit** on `getDocs` ([App.jsx:22](src/App.jsx#L22)) — every post ever made loads on every page view; will not scale.
- **No optimistic UI** — after posting, the whole list re-fetches from Firestore rather than appending locally.
- **No responsive/mobile layout considerations** beyond what's in [App.css](src/App.css) (fixed `%`-based widths).
- **No empty state** — if there are zero posts, the wall just renders blank with no "be the first to post" message.

## Tooling

- **No test setup** — no test runner, no component tests.
- **ESLint config exists** ([.eslintrc.cjs](.eslintrc.cjs)) but there's no CI wiring (e.g., GitHub Actions) enforcing `npm run lint` or `npm run build` before deploy.
- **Firebase Hosting** ([firebase.json](firebase.json), [.firebaserc](.firebaserc)) deploys `dist/` with no deploy-preview or CI step gating it — deploys appear to be manual (`firebase deploy`).

---
*Generated 2026-07-18 from a full read of the repo (`package.json`, `src/`, `firebase.json`, `.firebaserc`, `vite.config.js`, `tailwind.config.js`, `index.html`, `README.md`).*
