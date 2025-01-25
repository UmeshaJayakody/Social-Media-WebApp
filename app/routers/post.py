from typing import Optional

from sqlalchemy import func
from app import oauth2
from .. import models , schemas
from ..database import get_db
from fastapi import Response, HTTPException, status , Depends ,APIRouter,UploadFile, File
from sqlalchemy.orm import Session
import uuid

router = APIRouter(prefix="/posts" , tags=["Posts"])

# get all posts from database

@router.get("/" , response_model=list[schemas.PostOut])
def get_posts(db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user),limit : int = 10 ,skip : int = 0 , search : Optional[str] = ""):
    posts = db.query(models.Post ,func.count(models.Vote.post_id).label("votes")).join(models.Vote , models.Vote.post_id == models.Post.id , isouter=True).group_by(models.Post.id)
    return posts


# create new post in database
@router.post("/", status_code=status.HTTP_201_CREATED , response_model=schemas.Post)
def create_posts(post: schemas.PostCreate , db: Session = Depends(get_db) , current_user : int  = Depends(oauth2.get_current_user)):
    # new_post = models.Post(title=post.title, content=post.content, published=post.published)
    new_post = models.Post(owner_id = current_user.id,**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# get post by id from database
@router.get("/{id}", response_model=schemas.PostOut)
def get_post(id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    post = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(models.Post.id).filter(models.Post.id == id).first()
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"id : {id} Post not found")
    return post


# delete post by id from database
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(id: int , db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    existing_post = post_query.first()
    if existing_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"id : {id} Post not found")
    
    if existing_post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this post")
    
    post_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# update post by id from database
@router.patch("/f/{id}", response_model=schemas.Post)
def update_post(id: int, post: schemas.PostCreate, db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    existing_post = post_query.first()
    if existing_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"id : {id} Post not found")
    
    if existing_post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to update this post")
    post_query.update(post.dict(), synchronize_session=False)
    db.commit()
    return post_query.first()

# update post by id from database
@router.patch("/{id}", response_model=schemas.Post)
def patch_post(id: int, post: schemas.postpatch, db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    existing_post = post_query.first()
    if existing_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"id : {id} Post not found")
    
    if existing_post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to update this post")
    post_query.update(post.dict(), synchronize_session=False)
    db.commit()
    return post_query.first()


# get all posts from database
@router.get("/user/{id}" , response_model=list[schemas.PostOut])
def get_posts(id : int ,db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user),limit : int = 10 ,skip : int = 0 , search : Optional[str] = ""):
    posts = db.query(models.Post ,func.count(models.Vote.post_id).label("votes")).join(models.Vote , models.Vote.post_id == models.Post.id , isouter=True).group_by(models.Post.id).filter(models.Post.owner_id == id)
    return posts
