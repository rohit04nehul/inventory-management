from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database_models  # SQLAlchemy models
from database import SessionLocal, engine
from models import Product  # Pydantic model

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
database_models.Base.metadata.create_all(bind=engine)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize DB with full original sample data (resets on startup for dev)
def init_db():
    db = SessionLocal()
    try:
        # Wipe existing products to reset IDs from 1 (remove this line in production)
        db.query(database_models.Product).delete()
        db.commit()
        
        sample_products = [
            {"name": "Phone", "description": "A smartphone", "price": 699.99, "quantity": 50},
            {"name": "Laptop", "description": "A powerful laptop", "price": 999.99, "quantity": 30},
            {"name": "Pen", "description": "A blue ink pen", "price": 1.99, "quantity": 100},
            {"name": "Table", "description": "A wooden table", "price": 199.99, "quantity": 20},
        ]
        for p in sample_products:
            db.add(database_models.Product(**p))
        db.commit()
        print("✅ Database reset with original sample data (IDs 1-4).")
    finally:
        db.close()

init_db()

# Welcome endpoint
@app.get("/")
def greet():
    return {"message": "Welcome to KAKA TRAC"}

# Get all products
@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    return db.query(database_models.Product).all()

# Get product by ID
@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product Not Found")
    return product

# Add a new product (with optional ID)
@app.post("/products")
def add_product(product: Product, db: Session = Depends(get_db)):
    # Check if ID provided and exists
    if product.id:
        existing = db.query(database_models.Product).filter(database_models.Product.id == product.id).first()
        if existing:
            raise HTTPException(status_code=409, detail="ID already exists")
        new_product = database_models.Product(
            id=product.id,  # Use provided ID
            name=product.name,
            description=product.description,
            price=product.price,
            quantity=product.quantity
        )
    else:
        # Auto-increment as before
        new_product = database_models.Product(
            name=product.name,
            description=product.description,
            price=product.price,
            quantity=product.quantity
        )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# Update a product by ID (now supports updating ID too, but path ID takes precedence)
@app.put("/products/{id}")
def update_product(id: int, product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product Not Found")
    
    # If new ID provided and different, check and update (advanced; optional)
    if product.id and product.id != id:
        existing = db.query(database_models.Product).filter(database_models.Product.id == product.id).first()
        if existing:
            raise HTTPException(status_code=409, detail="New ID already exists")
        db_product.id = product.id  # Update ID (requires DB support)
    
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.quantity = product.quantity

    db.commit()
    db.refresh(db_product)
    return db_product

# Delete a product by ID
@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product Not Found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product Deleted Successfully"}