# Inventory Management App

A simple full-stack web app for managing product inventory. Built with **FastAPI** (backend) and **React** (frontend). Track products with CRUD operations, search, sort, and custom IDs.


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


