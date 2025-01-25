from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True
    content_linkd: Optional[str] = None

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at: datetime
    owner: UserOut

    class Config:
        from_attributes = True

class PostOut(BaseModel):
    Post: Post
    votes: int

    class Config:
        from_attributes = True


# Base class for UserCreate
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

class TokenData(BaseModel):
    id: Optional[str] = None

# Base class for Vote

class Vote(BaseModel):
    post_id: int
    dir: int

class CommentCreate(BaseModel):
    comment: str

class CommentOut(BaseModel):
    id: int
    post_id: int
    user_id: int
    comment: str
    created_at: datetime
    user : UserOut

    class Config:
        from_attributes = True

class friendIn(BaseModel):
    friend_id: int

class friendOut(BaseModel):
    user_id: int
    friend_id: int

    class Config:
        from_attributes = True

class friendOutall(BaseModel):
    user_id: int
    friend_id: int
    friend_details: UserOut

    class Config:
        from_attributes = True

class chatOut(BaseModel):
    id: int
    to_id: int
    from_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class chatIn(BaseModel):
    content : str

    class Config:
        from_attributes = True

class postpatch(BaseModel):
    title: str
    content: str    

    class Config:
        from_attributes = True

class AlternativeInfoResponse(BaseModel):
    id: int
    profile_photo: str
    background_photo: str
    introduction: str
    contact_number: str
    address: str
    birthday: str
    social_media_link_1: str
    social_media_link_2: str
    social_media_link_3: str

    class Config:
        from_attributes = True

class AlternativeInfoCreate_auto(BaseModel):
    id: int

    class Config:
        from_attributes = True


class AlternativeInfoUpdate(BaseModel):
    profile_photo: str
    background_photo: str
    introduction: str
    contact_number: str
    address: str
    birthday: str
    social_media_link_1: str
    social_media_link_2: str
    social_media_link_3: str

    class Config:
        from_attributes = True