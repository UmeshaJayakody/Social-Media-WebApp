# Social Media WebApp

Welcome to the Social Media App project! This project is a full-featured social media application built using FastAPI for the backend and JavaScript for the frontend. The app allows users to create profiles, post updates, connect with friends, and chat in real-time.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database](#Database)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

### **User Authentication and Authorization**

- **Registration:**  
  Users can sign up by providing their **name**, **email**, and **password**. Once registered, they can log in securely using their email and password.  

- **Login Process:**  
  The login process is managed using a **JWT (JSON Web Token)** system for secure authentication. The token expiration time is variable and can be configured via the `ACCESS_TOKEN_EXPIRE_MINUTES` variable in the `.env` file.  

- **Token Expiry:**  
  If the token expires, users are automatically redirected to the login page, where they can log in again to refresh their session with a new token.  

- **Visual Clarification:**  
  The following screenshots provide a clearer understanding of the user authentication flow.  
  Login 
  ![Login page](./images/login-page.png)
  Signup
  ![Signup page](./images/signup-page.png)


- **Profile creation and management**  
  - On registration, the app automatically creates a user account based on the provided information.  
  - At registration, users cannot add profile photos, backgrounds, or additional details.  
  - After logging in, users can update their profile with:  
    1. Introduction about themselves  
    2. Contact numbers  
    3. Birthday  
    4. Address  
    5. Social media links  
  - These details remain hidden until both users follow each other.  
  *(image1, image2 for more clarity)*  

- **Posting updates with text and media**  
  - After registration, users can create posts with:  
    1. Title  
    2. Content  
    3. Alternative content (optional image or video)  
  - Posts can be edited repeatedly.  
  - Users and friends can:  
    - Like/unlike posts  
    - Comment on posts  
    - View others' comments  
  - Users see their posts on their profile, while the home page displays posts from everyone.  
  - Users can visit other profiles and follow/unfollow them.  

- **Friend connections and friend list management**  
  - Users can follow and unfollow others.  
  - When both users follow each other, they can chat.  

- **Real-time chat functionality**  
  - Chat is real-time but currently not optimized.  

- **Responsive design for mobile and desktop**  
  - Currently designed for desktop only.  

## Installation

Install all dependencies using:  
```bash
pip install -r requirements.txt
```  

Run the app with:  
```bash
uvicorn app.main:app --reload --port 8000
```  

Start the login page from:  
[http://127.0.0.1:5501/static/login.html](http://127.0.0.1:5501/static/login.html)  

### Prerequisites

- Python 3.8+  
- Node.js and npm  
- MySQL (or any other preferred database)  

**Python dependencies:**  
```plaintext
alembic==1.14.0
annotated-types==0.7.0
anyio==4.7.0
argon2-cffi==23.1.0
argon2-cffi-bindings==21.2.0
bcrypt==3.2.0
certifi==2024.12.14
cffi==1.17.1
click==8.1.8
colorama==0.4.6
cryptography==44.0.0
dnspython==2.7.0
ecdsa==0.19.0
email_validator==2.2.0
fastapi==0.115.6
fastapi-cli==0.0.7
greenlet==3.1.1
h11==0.14.0
httpcore==1.0.7
httptools==0.6.4
httpx==0.28.1
idna==3.10
itsdangerous==2.2.0
Jinja2==3.1.5
Mako==1.3.8
markdown-it-py==3.0.0
MarkupSafe==3.0.2
mdurl==0.1.2
mysql-connector-python==9.1.0
orjson==3.10.12
passlib==1.7.4
pyasn1==0.6.1
pycparser==2.22
pydantic==2.10.4
pydantic-extra-types==2.10.1
pydantic-settings==2.7.0
pydantic_core==2.27.2
Pygments==2.18.0
python-dotenv==1.0.1
python-jose==3.3.0
python-multipart==0.0.20
PyYAML==6.0.2
rich==13.9.4
rich-toolkit==0.12.0
rsa==4.9
shellingham==1.5.4
six==1.17.0
sniffio==1.3.1
SQLAlchemy==2.0.36
starlette==0.41.3
typer==0.15.1
typing_extensions==4.12.2
ujson==5.10.0
uvicorn==0.34.0
watchfiles==1.0.3
websockets==14.1
```

### Backend Setup

1. Clone the repository:  
    ```bash
    git clone https://github.com/yourusername/social-media-app.git
    cd social-media-app
    ```  

2. Create a virtual environment and activate it:  
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```  

3. Install the required dependencies:  
    ```bash
    pip install -r requirements.txt
    ```  

4. Set up the database and apply migrations:  
    ```bash
    alembic upgrade head
    ```  

5. Run the FastAPI server:  
    ```bash
    uvicorn main:app --reload
    ```  

### Frontend Setup

1. Navigate to the `static` directory:  
    ```bash
    cd static
    ```  

2. Install the required dependencies:  
    ```bash
    npm install
    ```  

3. Build the frontend assets:  
    ```bash
    npm run build
    ```  

## Usage

1. Start the backend server:  
    ```bash
    uvicorn main:app --reload
    ```  

2. Open your browser and navigate to `http://127.0.0.1:8000` to access the application.  

## Database  

The database contains 7 tables. Refer to the below diagram for details:  
*(image)*  

## API Endpoints  

### Authentication  

- `POST /auth/login`: User login  
- `POST /auth/register`: User registration  

### User Profile  

- `GET /users/{user_id}`: Get user profile  
- `PUT /users/{user_id}`: Update user profile  

### Posts  

- `GET /posts`: Get all posts  
- `POST /posts`: Create a new post  
- `GET /posts/{post_id}`: Get a specific post  
- `DELETE /posts/{post_id}`: Delete a post  

### Friends  

- `GET /friends/all`: Get all friends  
- `POST /friends/{user_id}`: Add a friend  
- `DELETE /friends/{user_id}`: Remove a friend  

### Chat  

- `GET /chats/{friend_id}`: Get chat messages with a friend  
- `POST /chats/{friend_id}`: Send a chat message  

## Technologies Used  

- **Backend**: FastAPI, SQLAlchemy, Alembic  
- **Frontend**: HTML, CSS, JavaScript  
- **Database**: MySQL  
- **Authentication**: JWT (JSON Web Tokens)  
- **Real-time Communication**: WebSockets  

## Contributing  

This is an individual project.  
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the code style and include tests for any new features or bug fixes.
