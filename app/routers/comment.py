from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.get("/{post_id}", response_model=list[schemas.CommentOut])
def get_comments(post_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    if not comments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No comments found for this post")
    

    comments_with_user = []
    for comment in comments:
        user = db.query(models.User).filter(models.User.id == comment.user_id).first()
        comment_with_user = schemas.CommentOut(
            id=comment.id,
            post_id=comment.post_id,
            user_id=comment.user_id,
            comment=comment.comment,
            created_at=comment.created_at,
            user=user
        )
        comments_with_user.append(comment_with_user)
    
    return comments_with_user

@router.post("/{post__id}", status_code=status.HTTP_201_CREATED, response_model=schemas.CommentOut)
def create_comment(post__id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    new_comment = models.Comment(post_id=post__id, **comment.dict(), user_id=current_user.id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    user = db.query(models.User).filter(models.User.id == new_comment.user_id).first()
    comment_with_user = schemas.CommentOut(
        id=new_comment.id,
        post_id=new_comment.post_id,
        user_id=new_comment.user_id,
        comment=new_comment.comment,
        created_at=new_comment.created_at,
        user=user
    )
    
    return comment_with_user