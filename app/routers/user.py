from app import oauth2
from .. import models , schemas , utils
from ..database import engine , get_db
from fastapi import Response, HTTPException, status , Depends ,APIRouter
from sqlalchemy.orm import Session

router = APIRouter( prefix="/users" , tags=["Users"])

# create user in database
@router.post("/", status_code=status.HTTP_201_CREATED , response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate , db: Session = Depends(get_db)):
    # hash the password
    hash_password = utils.hash(user.password)
    user.password = hash_password
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_alternative_info = models.AlternativeInformation(id = new_user.id)
    db.add(new_alternative_info)
    db.commit()
    db.refresh(new_alternative_info)
    return new_user

@router.get('/{id}', response_model=schemas.UserOut)
def get_user(id: int , db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"id : {id} User not found")
    return user

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(db: Session = Depends(get_db),current_user : int  = Depends(oauth2.get_current_user)):
    db.query(models.User).filter(models.User.id == current_user.id).delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)