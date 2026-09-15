Workspace preparation plan

Purpose
- Prepare this repository for a focused cleanup and collaboration (backend + selected frontend apps).

What to keep (core functional parts)
- `backend/` — FastAPI backend (keep app, models, crud, schemas, database, config)
- `frontend/` — primary frontend (Vite + React) used for the main app
- `CAP_OS/` — other frontend; keep if you want both frontends maintained, otherwise archive
- `docs/` — documentation and SOPs (keep)
- `database/` — schema and db helpers (keep README and schema.sql)
- `scripts/` — helper scripts used for checks and seeding (keep useful ones)

What to remove or archive (candidates)
- `node_modules/`, `frontend/dist/`, `CAP_OS/node_modules/` — remove before committing
- `.venv-win`, `venv/`, `.python_envs/` — do not commit virtualenvs
- Large binary artifacts, exports, or temporary build files (search for large files)
- Editor-specific or OS-specific files not already in .gitignore

Files to inspect and possibly prune
- `frontend/src` and `CAP_OS/src` — remove unused components, examples, duplicated assets
- `backend/*egg-info`, `backend/.eggs`, or packaging artifacts
- `README.md`, `Read_me.txt`, `Implementation_plan.md` — merge and keep one clear README

Branching and workflow
- Create a cleanup branch to stage changes:
  - `git checkout -b cleanup/prepare-workspace`
  - Commit the prepared plan and small safe edits
- After review and agreement, create separate PRs for: file deletions, code comments, docs updates

Minimal commands to run locally (dev flow)
- Backend (recommended to use a venv):
  ```powershell
  cd backend
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
  ```

- Frontend (Vite):
  ```powershell
  cd frontend
  npm install
  npm run dev
  ```

Quick checks before pushing
- Remove `node_modules` and build artifacts
- Add/clean `.gitignore` (node_modules, .venv, dist, .env files, *.pyc)
- Run basic smoke tests: curl /health, open /docs

Next steps (I can take these if you confirm):
1. Produce an inventory list of files to remove (automated scan + manual review)
2. Create `cleanup/prepare-workspace` branch and commit `WORKSPACE_PREP.md`
3. Optionally create a `.gitignore` and minimal `README.md` draft

If you want me to proceed, tell me whether to keep both frontends (`frontend/` and `CAP_OS/`) or only one, and whether you want me to create the cleanup branch and a `.gitignore` now.
