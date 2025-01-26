from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(prefix="/friends", tags=["friends"])

@router.get("/all", response_model=list[schemas.friendOutall])
def get_friends(db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    friends = db.query(models.Friend).filter(models.Friend.user_id == current_user.id).all()
    friends_with_details = []
    for friend in friends:
        friend_details = db.query(models.User).filter(models.User.id == friend.friend_id).first()
        friends_with_details.append({
            "user_id": friend.user_id,
            "friend_id": friend.friend_id,
            "friend_details": friend_details
        })
    return friends_with_details

@router.post("/", response_model=schemas.friendOut)
def friend_request(friend_for: schemas.friendIn, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    friend = db.query(models.User).filter(models.User.id == friend_for.friend_id).first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")
    existing_friend = db.query(models.Friend).filter(
        models.Friend.user_id == current_user.id,
        models.Friend.friend_id == friend_for.friend_id
    ).first()
    
    if existing_friend:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Friend relationship already exists")

    new_friend = models.Friend(user_id=current_user.id, friend_id=friend_for.friend_id)
    db.add(new_friend)
    db.commit()
    db.refresh(new_friend)
    
    return new_friend

@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfriend(friend_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    friend = db.query(models.User).filter(models.User.id == friend_id).first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")

    existing_friend = db.query(models.Friend).filter(
        models.Friend.user_id == current_user.id,
        models.Friend.friend_id == friend_id
    ).first()
    
    if not existing_friend:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Friend relationship does not exist")

    db.delete(existing_friend)
    db.commit()
    
    return existing_friend

@router.get("/{friend_id}", response_model=bool)
def is_friend(friend_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    friend = db.query(models.User).filter(models.User.id == friend_id).first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")

    existing_friend = db.query(models.Friend).filter(
        models.Friend.user_id == current_user.id,
        models.Friend.friend_id == friend_id
    ).first()
    
    return existing_friend is not None

@router.get("/dualside/{friend_id}", response_model=bool)
def is_friend_dualside(friend_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    friend = db.query(models.User).filter(models.User.id == friend_id).first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")

    first_relation = db.query(models.Friend).filter(
        (models.Friend.user_id == current_user.id) & (models.Friend.friend_id == friend_id)
    ).first()

    second_relation = db.query(models.Friend).filter(
        (models.Friend.user_id == friend_id) & (models.Friend.friend_id == current_user.id)
    ).first()

    return first_relation is not None and second_relation is not None
