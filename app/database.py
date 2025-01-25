# Purpose: This file is used to create a database connection and session for the FastAPI application. It uses SQLAlchemy to connect to the MySQL database and create a session for the application to interact with the database. The get_db function is used as a dependency to provide a database session to the API endpoints when they need to interact with the database.
# filepath: /d:/Coding/fastapi/app/database.py
# import libraries
import mysql.connector
import time
from mysql.connector import Error
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# connect to mysql database
"""
while True:
    try:
        connection = mysql.connector.connect(host='localhost', database='fastapi_database', user='root', password=None)
        cursor = connection.cursor()
        print("You're connected to database successfully")
        break
    except Error as error:
        print("Error while connecting to MySQL", error)
        time.sleep(2)
 """