from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(prefix="/alternatives", tags=["Alternatives"])

@router.get("/{user_id}", response_model=schemas.AlternativeInfoResponse)
def get_alternative_info(user_id :int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    alternative_info = db.query(models.AlternativeInformation).filter(models.AlternativeInformation.id == user_id).first()
    if alternative_info is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"id : {user_id} Alternative Info not found")
    return alternative_info

@router.post("/", response_model=schemas.AlternativeInfoResponse)
def create_alternative_info(alternative_info: schemas.AlternativeInfoCreate_auto, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    new_alternative_info = models.AlternativeInformation(**alternative_info.dict())
    db.add(new_alternative_info)
    db.commit()
    db.refresh(new_alternative_info)
    return new_alternative_info

@router.patch("/", response_model=schemas.AlternativeInfoResponse)
def update_alternative_info(alternative_info: schemas.AlternativeInfoUpdate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    db.query(models.AlternativeInformation).filter(models.AlternativeInformation.id == current_user.id).update(alternative_info.dict())
    db.commit()
    updated_alternative_info = db.query(models.AlternativeInformation).filter(models.AlternativeInformation.id == current_user.id).first()
    return updated_alternative_info
