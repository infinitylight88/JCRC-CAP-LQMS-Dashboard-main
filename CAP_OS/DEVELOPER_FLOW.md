# CAP OS: Developer Flow

## Purpose and technology

CAP OS is a separate CAP-readiness dashboard interface. It is a Vite 6,
TypeScript, and React application. Its component library includes Material UI,
Radix UI, and Lucide icons. Styling is primarily Tailwind CSS 4 utilities,
enabled by `@tailwindcss/vite`, with shared CSS in `src/styles/index.css`.

## Start and browse

```powershell
cd CAP_OS
npm install
npm run dev
```

Vite serves CAP OS at `http://localhost:5005`.

## Code and route flow

```text
index.html
  -> src/main.tsx
     -> imports global styles and mounts <App />
        -> src/app/App.tsx
           -> <RouterProvider router={router}>
              -> src/app/routes.tsx
                 -> Root / AppShell
                    -> Sidebar + page component
                       -> Dashboard or Compliance screen
```

- `src/main.tsx` is the browser entry point.
- `src/app/App.tsx` supplies the React Router provider.
- `src/app/routes.tsx` defines `/`, `/cap-readiness`, and the fallback screen.
  `Root` and `AppShell` provide the shared responsive sidebar layout.
- `src/app/components` contains reusable visual/layout components.
- `src/app/pages` contains screen-level features such as the dashboard and CAP
  readiness/compliance view.
- `src/styles` contains global styling, while Tailwind utilities are applied in
  the TSX components.

## Data integration status

CAP OS is presently structured as a routed dashboard UI. Its configured API
base lives in `.env`:

```text
VITE_API_URL=http://127.0.0.1:5003
```

Vite exposes this value to browser code as `import.meta.env.VITE_API_URL`. Use
it for any new data client rather than hard-coding a hostname:

```ts
const apiBase = import.meta.env.VITE_API_URL;
const response = await fetch(`${apiBase}/sections`);
```

This points to the LabQMS FastAPI service, not the Sysmex Middleware Flask API
on port 8000. The `.env` file is read when Vite starts/builds; restart the dev
server after changing it.

## Database boundary

CAP OS must not connect to SQLite or PostgreSQL from browser code. All database
access goes through the LabQMS FastAPI JSON API:

```text
CAP OS page -> API client using VITE_API_URL -> FastAPI route
            -> Pydantic validation -> CRUD helper -> database
```

The shared domain currently includes sections, SOPs, staff, competency records,
and equipment. The database schema is owned and documented by the backend in
`../backend/DEVELOPER_FLOW.md`.

## Change checklist

1. Place reusable UI in `src/app/components` and routed screens in
   `src/app/pages`.
2. Add routes in `src/app/routes.tsx` and preserve the shared `AppShell` when
   the new screen needs the sidebar.
3. Define or extend the FastAPI endpoint and response schema before consuming
   it in CAP OS.
4. Read the API base from `import.meta.env.VITE_API_URL`.
5. Run `npm run build` before merging to `main`.
