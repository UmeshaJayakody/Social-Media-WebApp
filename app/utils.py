# Description: This file contains the utility functions that are used in the application.
# filepaths: /d:/Coding/fastapi/app/utils.py
# import libraries
from passlib.context import CryptContext

# create a new instance of CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# hash password
def hash(password: str):
    return pwd_context.hash(password)

# verify password
def verify(hashed_password, plain_password):
    return pwd_context.verify(plain_password, hashed_password)

