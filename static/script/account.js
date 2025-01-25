        const loading = document.getElementById('loading');
        const content = document.getElementById('content');
    

        function showLoading() {
            loading.style.display = 'flex';
            content.style.display = 'none';
        }
    
        function hideLoading() {
            loading.style.display = 'none';
            content.style.display = 'block';
        }

        showLoading();
        setTimeout(() => {
            hideLoading();
        }, 500);

function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        container.appendChild(particle);
    }
}

document.addEventListener('mousemove', (e) => {
    const spheres = document.querySelectorAll('.gradient-sphere');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    spheres.forEach((sphere, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (0.5 - x) * speed;
        const yOffset = (0.5 - y) * speed;
        
        sphere.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${1 + (index * 0.1)})`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    const elements = document.querySelectorAll('.form-group, .submit-button, .divider, .social-login, .additional-options');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
});

document.querySelectorAll('.submit-button, .social-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.animation = 'ripple 0.6s ease-out';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

async function getimageloction(typeoffile, given_id){
    const token = localStorage.getItem('access_token');
    if (!token) {
        Toastify({
            text: 'You are not logged in. Redirecting to login page.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/alternatives/${given_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            Toastify({
                text: 'Failed to fetch posts. Please try again later.',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'rgba(228, 0, 19, 0.8)',
                stopOnFocus: true
            }).showToast();
            window.location.href = 'http://127.0.0.1:5501/static/login.html';
            return;
        }
        const data = await response.json();
        if(typeoffile == 'dp'){
            return `../app/uploads/${data.profile_photo}`;
        }
        else if(typeoffile == 'cover'){
            return `../app/uploads/${data.background_photo}`;
        }
        else if(typeoffile == 'intro'){
            return `${data.introduction}`;
        }

    } catch (error) {
        console.error('Error fetching posts:', error);
    }}
async function fetchPosts() {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    if (!token) {
        Toastify({
            text: 'You are not logged in. Redirecting to login page.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/posts/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            Toastify({
                text: 'Failed to fetch posts. Please try again later.',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'rgba(228, 0, 19, 0.8)',
                stopOnFocus: true
            }).showToast();
            window.location.href = 'http://127.0.0.1:5501/static/login.html';
            return;
        }

        const posts = await response.json();
        const postsContainer = document.getElementById('login-container');
        postsContainer.innerHTML = '';

        for (const post of posts) {
            const userVoted = await checkUserVote(post.Post.id);
            const postElement = document.createElement('div');
            postElement.classList.add('login-container');
            postElement.innerHTML = `
                <div class="frame__headline">
                    <img class="headline__image" src="${await getimageloction("dp",post.Post.owner.id)}" alt="Profile Image">
                    <div class="frame__column">
                    <p class="headline__title profile-button" data-user-id="${post.Post.owner.id}">${post.Post.owner.name}</p>
                    <p class="headline__subtitle">${new Date(post.Post.created_at).toLocaleString()}</div>
                    
                </div>
                    <button class = "edit-button" data-post-id="${post.Post.id}" >Edit post</button>
                <div class="frame__content" data-post-id="${post.Post.id}">
                    <h2 class= "content_head">${post.Post.title}</h2>
                    <p class="frame__text--small">${post.Post.content}</p>
                    ${post.Post.content_linkd ? renderMedia(post.Post.content_linkd) : ''}
                </div>
                <div>
                    
    <div class="post-actions">
    <div class = 'vote-section' data-post-id="${post.Post.id}">
        <button class='like-button' onclick="votePost(${post.Post.id}, ${userVoted ? 0 : 1})">
<img src="${userVoted ? './images/heart-not.png' : './images/heart.png'}" alt="${userVoted ? 'Remove Vote' : 'Upvote'}" style="width: 25px; height: 25px;">
<span class="count">${post.votes}</span>
</button>

            </div>
           
            <div class="comment-form" id="comment-form-${post.Post.id}">
                <textarea class="comment-typing" id="comment-text-${post.Post.id}" rows="1" cols="50" placeholder="Write a comment..."></textarea>
                <button class ="post-comment" onclick="postComment(${post.Post.id})">Post</button>
            </div>
        </div>
        <dev class="comments">
<button class="show-comments-button" data-post-id="${post.Post.id}">Show Comments</button>
</div>
<div class="comments-container" id="comments-container-${post.Post.id}" style="display: none;"></div>

`;
function renderMedia(contentLink) {
    const extension = contentLink.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return `<img src="../app/uploads/${contentLink}" alt="Post Image">`;
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return `
            <video controls autoplay muted loop>
                <source src="../app/uploads/${contentLink}" type="video/${extension}">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        return '';
    }
}
postsContainer.appendChild(postElement);
}

async function fetchComments(postId, token) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/comments/${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            Toastify({
                text: 'No comments in this post',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'rgba(228, 0, 19, 0.8)',
                stopOnFocus: true
            }).showToast();
            throw new Error('Network response was not ok');
        }
        const comments = await response.json();
        const commentsContainer = document.getElementById(`comments-container-${postId}`);
        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment ">
                <p class = "commentor" > ${comment.user.name}</p>
                <p class =" comment_text">${comment.comment}</p>
                <p class= "comment_time" >${new Date(comment.created_at).toLocaleString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

document.querySelectorAll('.show-comments-button').forEach(button => {
    button.addEventListener('click', function() {
        const postId = this.getAttribute('data-post-id');
        const commentsContainer = document.getElementById(`comments-container-${postId}`);
        const token = localStorage.getItem('access_token'); 
        if (!token) {
            Toastify({
                text: 'You are not logged in. Redirecting to login page.',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'rgba(228, 0, 19, 0.8)',
                stopOnFocus: true
            }).showToast();
            window.location.href = 'http://127.0.0.1:5501/static/login.html';
            return;
        }
        if (commentsContainer.style.display === 'none') {
            fetchComments(postId, token);
            commentsContainer.style.display = 'block';
        } else {
            commentsContainer.style.display = 'none';
        }
    });
});
                    
document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', function() {
        const postId = this.getAttribute('data-post-id');
        localStorage.setItem('post_id', postId);
        window.location.href = 'http://127.0.0.1:5501/static/post.html';
        });
    });

document.querySelectorAll('.profile-button').forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');
        localStorage.setItem('post_user_id', userId);
        window.location.href = `http://127.0.0.1:5501/static/profile.html`;
    });
});
document.querySelectorAll('.comment-button').forEach(button => {
    button.addEventListener('click', function() {
        const postId = this.getAttribute('data-post-id');
        const commentForm = document.getElementById(`comment-form-${postId}`);
        commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none' ;
    });
});

} catch (error) {
console.error('Error fetching posts:', error);
Toastify({
    text: 'Something went wrong. Please try again later.',
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor: 'rgba(228, 0, 19, 0.8)',
    stopOnFocus: true
}).showToast();
}
}

async function checkUserVote(postId) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        Toastify({
            text: 'You are not logged in. Redirecting to login page.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return false;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/vote/check/${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to check vote status.');
            return false;
        }

        const userVoted = await response.json();
        return userVoted;
    } catch (error) {
        console.error('Error checking vote status:', error);
        return false;
    }
}
async function votePost(postId, dir) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        Toastify({
            text: 'You are not logged in. Redirecting to login page.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ post_id: postId, dir: dir })
        });

        if (!response.ok) {
            const errorText = dir === 1 ? 'Failed to upvote. Please try again later.' : 'Failed to remove vote. Please try again later.';
            Toastify({
                text: errorText,
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'rgba(228, 0, 19, 0.8)',
                stopOnFocus: true
            }).showToast();
            return;
        }

        const voteSection = document.querySelector(`.vote-section[data-post-id="${postId}"]`);
        const likeButton = voteSection.querySelector('.like-button');
        const voteCount = likeButton.querySelector('.count');
        const voteIcon = likeButton.querySelector('img');

        if (dir === 1) {
            voteIcon.src = './images/heart-not.png';
            voteIcon.alt = 'Remove Vote';
            voteCount.textContent = parseInt(voteCount.textContent) + 1;
            likeButton.setAttribute('onclick', `votePost(${postId}, 0)`); 
        } else {
            voteIcon.src = './images/heart.png';
            voteIcon.alt = 'Upvote';
            voteCount.textContent = parseInt(voteCount.textContent) - 1;
            likeButton.setAttribute('onclick', `votePost(${postId}, 1)`); 
        }

        const successText = dir === 1 ? 'Vote successful!' : 'Vote removed successfully!';
        Toastify({
            text: successText,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(0, 255, 0, 0.8)',
            stopOnFocus: true
        }).showToast();
    } catch (error) {
        console.error('Error voting on post:', error);
        Toastify({
            text: 'Something went wrong. Please try again later.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
    }
}
        
        
        
async function postComment(postId) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        
        Toastify({
            text: 'You are not logged in. Redirecting to login page.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }

    const commentText = document.getElementById(`comment-text-${postId}`).value;
    if (!commentText) {
        Toastify({
            text: 'Comment cannot be empty.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(228, 0, 19, 0.8)',
            stopOnFocus: true
        }).showToast();
        return;
    }

    try {
        const response = await fetch( `http://127.0.0.1:8000/comments/${postId} `, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ post_id: postId, comment: commentText })
        });

        if (!response.ok) {
            Toastify({
                text: 'Failed to post comment. Please try again later.',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'rgba(228, 0, 19, 0.8)',
                stopOnFocus: true
            }).showToast();
            return;
        }

        Toastify({
            text: 'Comment posted successfully!',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(0, 255, 0, 0.8)',
            stopOnFocus: true
        }).showToast();
        document.getElementById(`comment-text-${postId}`).value = '';
    } catch (error) {
        console.error('Error posting comment:', error);
        alert('Something went wrong. Please try again later.');
    }
}
fetchPosts();



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('log_out').addEventListener('click', function(event) {
        event.preventDefault(); 
        localStorage.removeItem('access_token');
        Toastify({
            text: 'Logged out successfully!',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'rgba(0, 255, 0, 0.8)',
            stopOnFocus: true
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
    });
}
);        

async function fetchUserInfo() {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    if (!token || !userId) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info. Please log in again.');
        }

        const user = await response.json();
        document.getElementById('account-container').innerHTML=`
        <div id="profile-upper">
        <div id="profile-banner-image">
        <img src="${await getimageloction("cover",user.id)}" alt="Banner image">
        </div>
        <div id="profile-d">
<div id="profile-pic">
<img src="${await getimageloction("dp",user.id)}" alt="Profile Image">
</div>
<div id="u-name">${user.name}<button class="create_post">Create new post</button>
<button class="edit-profile">Edit profile</button>
<p class="info"> ${await getimageloction("intro",user.id)}<p>
</div>`
document.querySelector('.create_post').addEventListener('click', function() {
window.location.href = 'http://127.0.0.1:5501/static/createPost.html';
});
document.querySelector('.edit-profile').addEventListener('click', function() {
window.location.href = "http://127.0.0.1:5501/static/moreinfoadd.html";
});
    } catch (error) {
        console.error('Error fetching user info:', error);
        alert(error.message);
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
    }
}
fetchUserInfo();