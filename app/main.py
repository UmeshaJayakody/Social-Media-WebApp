# Description: This file contains the main code for the FastAPI application. It defines the routes and handlers for the API endpoints, as well as the database connection and model definitions.
# filepath: /d:/Coding/fastapi/app/main.py
# import libraries

import os
import uuid
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.routers import alternativeInfo, friend
from . import models
from .database import engine 
from .routers import chats, post, user , auth , vote , comment
from .config import settings
from fastapi.middleware.cors import CORSMiddleware
from app import models, schemas, utils, database, oauth2
from fastapi import Depends

# create tables in database
#models.Base.metadata.create_all(bind=engine)

# create FastAPI instance
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# origins for CORS
origins = ["*"]
# add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth.router)
app.include_router(post.router)
app.include_router(user.router)
app.include_router(vote.router)
app.include_router(comment.router)
app.include_router(friend.router)
app.include_router(chats.router)
app.include_router(alternativeInfo.router)


@app.get("/")
async def root():
    return {"message": "Hello! World"}



@app.get("/login_page")
def get_login():
    with open("static/login.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)
    
@app.get("/posts_page")
def get_posts_page():
    with open("static/posts.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)
    
@app.get("/register_page")
def get_register_page():
    with open("static/register.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)
    
@app.get("/my_account_page")
def get_my_account():
    with open("static/myAccount.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/editPost")
def get_edit_post():
    with open("static/editPost.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/createPost")
def get_create_post():
    with open("static/createPost.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)
    
# file upload
UPLOAD_DIR = "app/uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...)):
    # Determine the file extension based on the MIME type
    mime_type = file.content_type
    if mime_type.startswith('image/'):
        if mime_type == 'image/jpeg':
            extension = '.jpg'
        elif mime_type == 'image/png':
            extension = '.png'
        elif mime_type == 'image/gif':
            extension = '.gif'
        else:
            return {"error": "Unsupported image type"}
    elif mime_type.startswith('video/'):
        if mime_type == 'video/mp4':
            extension = '.mp4'
        elif mime_type == 'video/webm':
            extension = '.webm'
        elif mime_type == 'video/ogg':
            extension = '.ogg'
        else:
            return {"error": "Unsupported video type"}
    else:
        return {"error": "Unsupported file type"}

    # Generate a unique filename with the correct extension
    file.filename = f"{uuid.uuid4()}{extension}"
    contents = await file.read()
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save the file
    with open(file_path, "wb") as f:
        f.write(contents)

    return {"filename": file.filename}

@app.get("/profile")
def get_profile():
    with open("static/profile.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/hisposts")
def get_hisprofile():
    with open("static/hisposts.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)
    
@app.get("/friends_page")
def get_friends_page():
    with open("static/friends_list.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)