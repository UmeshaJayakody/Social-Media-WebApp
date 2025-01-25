# Description: This file contains the models for the database tables.
# filepaths: /d:/Coding/fastapi/app/models.py
# import libraries
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func
from .database import Base
from sqlalchemy.orm import relationship

# create Post table
class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title = Column(String(255), nullable=False)  
    content = Column(String(255), nullable=False) 
    published = Column(Boolean, server_default='1', nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    owner_id = Column(Integer,ForeignKey("users.id" , ondelete="CASCADE") ,nullable=False)
    content_linkd = Column(String(255), nullable=True)

    owner = relationship("User")

# create User table
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
# create Vote table
class Vote(Base):
    __tablename__ = "votes"
    
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"),primary_key= True ,nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),primary_key= True, nullable=False)

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    comment = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

class Friend(Base):
    __tablename__ = "friends"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),primary_key= True, nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),primary_key= True, nullable=False)
    
class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    to_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    from_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

class AlternativeInformation(Base):
    __tablename__ = "alternative_infomations"

    id = Column(Integer,ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, nullable=False)
    profile_photo = Column(String(255), server_default='default_dp.jpg', nullable=False)
    background_photo = Column(String(255),server_default='default_background.jpg', nullable=False)
    introduction = Column(String(255),server_default="None", nullable = False )
    contact_number = Column(String(255), server_default="None", nullable = False )
    address = Column(String(255), server_default="None", nullable = False )
    birthday = Column(String(255), server_default="None", nullable = False )
    social_media_link_1 = Column(String(255), server_default="None", nullable = False )
    social_media_link_2 = Column(String(255), server_default="None", nullable = False )
    social_media_link_3 = Column(String(255), server_default="None", nullable = False )
    