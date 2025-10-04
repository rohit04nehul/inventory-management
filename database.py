import os
from dotenv import load_dotenv
load_dotenv()  # Loads .env

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Secure: Load from .env or environment variable
db_url = os.getenv("DB_URL")
if not db_url:
    raise ValueError("DB_URL environment variable is not set. Please set it in your .env file or environment.")

engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()