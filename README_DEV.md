Developer run instructions (local)

This document explains how to run the backend and both frontends locally for development.

Backend (Windows / PowerShell)

1. Open PowerShell in the `backend` folder:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# If the project uses editable install use: pip install -e .
```
2. Create a `.env` file if needed or rely on defaults in `backend/app/config.py`.
3. Start the backend (development server):
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Backend (macOS / Linux)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Frontend (primary `frontend` - Vite)

```powershell
cd frontend
npm install
# Windows PowerShell: use npm.cmd if execution policy blocks npm.ps1
npm.cmd run dev
# or
npx vite --port 6000
```

Frontend (CAP_OS)

```powershell
cd CAP_OS
pnpm install
pnpm dev
# or if using npm
npm install
npm run dev
```

Notes
- `frontend/vite.config.js` is configured to proxy `/api` to `http://127.0.0.1:8001` so the frontend should be able to call the backend using `/api/...` paths when running under Vite dev.
- Before committing changes, remove large build artifacts and `node_modules` from the repository. Use the included `.gitignore`.

Quick checks
- Backend health: `curl http://127.0.0.1:8001/health`
- OpenAPI UI: `http://127.0.0.1:8001/docs`

If you'd like, I can:
- create a `cleanup/prepare-workspace` branch and commit these changes (I attempted earlier). If you prefer, run the git commands locally and I will continue with planned cleanup changes.
