# LabQMS Frontend: Developer Flow

## Purpose and technology

This folder contains the LabQMS operational user interface: SOP management,
competency tracking, laboratory staffing, and equipment records. It is a React
19 single-page application built and served locally by Vite 5. Styling is
custom CSS in `src/index.css`; this application does **not** use Tailwind CSS.

## Start and browse

```powershell
cd frontend
npm install
npm run dev
```

The Vite server listens on `http://localhost:5004`. The FastAPI backend must
already be running on `http://localhost:5003`.

## Code flow

```text
index.html
  -> src/main.jsx
     -> mounts <App /> into #root
        -> src/App.jsx
           -> creates Axios client
           -> fetchAll() loads reference and operational data
           -> React state drives the active dashboard tab and forms
           -> submit/update helpers send API requests
           -> FastAPI API -> SQLite/PostgreSQL database
```

`src/main.jsx` is intentionally small: it creates the React root and imports
the application-wide stylesheet. `src/App.jsx` is currently the main feature
module. It owns page state, form state, API calls, and reusable visual helpers
such as tables, panels, notifications, and multi-select controls.

On initial render, `fetchAll()` requests SOP books, SOPs, equipment, tests,
competency procedures, staff, competency records, and laboratory sections in
parallel. Successful responses are stored in React state. Form submissions call
the relevant `POST` or `PUT` endpoint, then call `fetchAll()` again so the UI
shows the committed database state.

## API routing

`App.jsx` creates Axios with this base URL:

```js
import.meta.env.VITE_API_URL || '/api'
```

The checked-in `.env` leaves `VITE_API_URL` empty. Therefore, local browser
requests use `/api`, and `vite.config.js` proxies them to
`http://127.0.0.1:5003`, removing the `/api` prefix. For example:

```text
Browser:  GET http://localhost:5004/api/staff
Vite:     GET http://127.0.0.1:5003/staff
FastAPI:  reads the database and returns JSON
```

Keep the proxy and backend port aligned. A `VITE_API_URL` value is compiled
into the frontend when Vite starts, so restart `npm run dev` after changing it.

## Main API resources used by this UI

- `/sections`, `/tests`
- `/sop-books`, `/sops`, `/sops/{id}/versions`, `/sop-import`
- `/equipment`
- `/competency-procedures`, `/competency-records`
- `/staff`

The definitive endpoint contract is the OpenAPI page at
`http://localhost:5003/docs` while the backend is running.

## Database ownership

This frontend never opens the database directly. It only handles JSON over
HTTP. The Python backend owns validation, relationships, database sessions,
and persistence. See `../backend/DEVELOPER_FLOW.md` for the full schema and
data rules.

## Change checklist

1. Add or update a FastAPI schema and route before adding a new API call here.
2. Keep form property names and numeric ID conversions aligned with the
   Pydantic request model.
3. Refresh affected state after a write; use `fetchAll()` where a complete
   refresh is appropriate.
4. Run `npm run build` before merging to `main`.
5. Do not point this app at Sysmex Middleware on port 8000; it is a separate
   service. This app's API is LabQMS FastAPI on port 5003.
