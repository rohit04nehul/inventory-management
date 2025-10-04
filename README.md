# Inventory Management App

A simple full-stack web app for managing product inventory. Built with **FastAPI** (backend) and **React** (frontend). Track products with CRUD operations, search, sort, and custom IDs.

![App Screenshot](https://via.placeholder.com/800x400?text=App+Preview) *(Add your screenshot here for better visuals!)*

## Features
- **Add/Edit/Delete Products**: With optional custom IDs.
- **Search & Sort**: By ID, name, description, price, or quantity.
- **Responsive UI**: Clean design with loading states and error handling.
- **Secure DB**: PostgreSQL with env vars for credentials.

## Tech Stack
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React, Axios
- **Other**: dotenv for secrets, Git for version control

## Quick Setup

### Prerequisites
- Python 3.9+ and Node.js 18+
- PostgreSQL database (e.g., local or cloud)

### Backend (FastAPI)
1. Clone the repo: `git clone https://github.com/rohit04nehul/inventory-management.git`
2. Navigate: `cd backend`
3. Install deps: `pip install -r requirements.txt`
4. Create `.env`:
5. Run: `uvicorn main:app --reload`  
*(Server at http://localhost:8000 | Docs: http://localhost:8000/docs)*

### Frontend (React)
1. Navigate: `cd frontend`
2. Install deps: `npm install`
3. Create `.env`:
4. 4. Run: `npm start`  
*(App at http://localhost:3000)*

## Usage
- Open the app in browser.
- Add products via form (try custom ID!).
- Search/sort in the table.
- Edit/Delete with confirmation.

## Project Structure

inventory-management/
├── README.md                  # Project overview & setup guide
├── .gitignore                 # Excludes secrets & junk files
├── requirements.txt           # Backend Python dependencies
│
├── backend/                   # FastAPI API server
│   ├── main.py                # Core app & routes (CRUD endpoints)
│   ├── database.py            # Secure DB connection (PostgreSQL)
│   ├── database_models.py     # SQLAlchemy models (Product schema)
│   ├── models.py              # Pydantic schemas for validation
│   └── .env                   # Local secrets (DB_URL - gitignored!)
│
├── frontend/                  # React client app
│   ├── public/                # Static assets (index.html, favicon)
│   ├── src/
│   │   ├── App.js             # Main component (form, table, logic)
│   │   ├── App.css            # Styles & layout
│   │   └── TaglineSection.js  # Sidebar tagline component
│   ├── package.json           # Node dependencies & scripts
│   └── .env                   # Local config (API URL - gitignored!)
│
└── LICENSE                    # MIT open-source license
