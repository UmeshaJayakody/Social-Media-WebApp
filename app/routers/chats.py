from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(prefix="/chats", tags=["chats"])

@router.post("/{to_user}", response_model=schemas.chatOut)
def compose_massage(friend_massage: schemas.chatIn, to_user: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    massage = models.Chat(to_id=to_user, from_id=current_user.id, **friend_massage.dict())
    db.add(massage)
    db.commit()
    db.refresh(massage)
    return massage

from sqlalchemy import or_

@router.get("/{from_user}", response_model=list[schemas.chatOut])
def get_massages(from_user: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    massages = db.query(models.Chat).filter(
        or_(
            (models.Chat.to_id == current_user.id) & (models.Chat.from_id == from_user),
            (models.Chat.to_id == from_user) & (models.Chat.from_id == current_user.id)
        )
    ).all()
    if not massages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Massages not found")
    return massages