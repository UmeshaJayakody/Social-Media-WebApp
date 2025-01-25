from fastapi import Response, HTTPException, status , Depends ,APIRouter
from ..import schemas , models , database ,oauth2
from sqlalchemy.orm import Session

router = APIRouter( prefix="/vote" , tags=["Vote"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_vote(vote: schemas.Vote, db: Session = Depends(database.get_db), current_user: int = Depends(oauth2.get_current_user)):
    post = db.query(models.Post).filter(models.Post.id == vote.post_id).first()
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    vote_query = db.query(models.Vote).filter(models.Vote.post_id == vote.post_id, models.Vote.user_id == current_user.id)
    existing_vote = vote_query.first()
    if (vote.dir == 1):
        if existing_vote:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You have already voted")
        new_vote = models.Vote(post_id=vote.post_id,user_id=current_user.id)
        db.add(new_vote)
        db.commit()
        return {"message": "Vote created successfully"}
    else:
        if existing_vote is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vote not found")
        vote_query.delete()
        db.commit()
        return {"message": "Vote deleted successfully"}
    

@router.get("/check/{post_id}", response_model=bool)
def check_vote(post_id: int, db: Session = Depends(database.get_db), current_user: int = Depends(oauth2.get_current_user)):
    vote_query = db.query(models.Vote).filter(models.Vote.post_id == post_id, models.Vote.user_id == current_user.id)
    existing_vote = vote_query.first()
    return existing_vote is not None