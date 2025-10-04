### Inventory Management App

A simple full-stack web app for managing product inventory. Built with FastAPI (backend) and React (frontend). Track products with CRUD operations, search, sort, and custom IDs.
Failed to load imageView link (Add your screenshot here for better visuals!)
Features

Add/Edit/Delete Products: With optional custom IDs.
Search & Sort: By ID, name, description, price, or quantity.
Responsive UI: Clean design with loading states and error handling.
Secure DB: PostgreSQL with env vars for credentials.

Tech Stack

Backend: FastAPI, SQLAlchemy, PostgreSQL
Frontend: React, Axios
Other: dotenv for secrets, Git for version control

Quick Setup
Prerequisites

Python 3.9+ and Node.js 18+
PostgreSQL database (e.g., local or cloud)

Backend (FastAPI)

Clone the repo: git clone https://github.com/rohit04nehul/inventory-management.git
Navigate: cd backend
Install deps: pip install -r requirements.txt
Create .env:
textDB_URL=postgresql://user:password@localhost:5432/your_db

Run: uvicorn main:app --reload
(Server at http://localhost:8000 | Docs: http://localhost:8000/docs)

Frontend (React)

Navigate: cd frontend
Install deps: npm install
Create .env:
textREACT_APP_API_URL=http://localhost:8000

Run: npm start
(App at http://localhost:3000)

Usage

Open the app in browser.
Add products via form (try custom ID!).
Search/sort in the table.
Edit/Delete with confirmation.

Project Structure
textinventory-management/
├── backend/          # FastAPI server
│   ├── main.py       # API routes
│   ├── database.py   # DB connection
│   └── ...           # Models & utils
├── frontend/         # React app
│   ├── src/App.js    # Main component
│   └── ...           # Components & styles
├── README.md         # This file!
└── .gitignore        # Excludes venv/.env
Contributing
Fork the repo, make changes, and submit a PR. Keep it simple!
License
MIT License - feel free to use/modify.
