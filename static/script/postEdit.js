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

} catch (error) {
    console.error('Error fetching posts:', error);
}}
async function fetchPost() {
const token = localStorage.getItem('access_token');
const postId = localStorage.getItem('post_id');
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
    const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`, {
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
    const post = await response.json();
    document.getElementById('login-container').innerHTML = `
    <div class="login-container">
            <div class="frame__headline">
                <img class="headline__image" src="${await getimageloction("dp",post.Post.owner.id)}" alt="Profile Image">
                <div class="frame__column">
                <p class="headline__title profile-button" data-user-id="${post.Post.owner.id}">${post.Post.owner.name}</p>
                <p class="headline__subtitle">${new Date(post.Post.created_at).toLocaleString()}</div>
            </div>
            <div class="frame__content">
                <h2 class= "content_head">${post.Post.title}</h2>
                <p class="frame__text--small">${post.Post.content}</p>
                ${post.Post.content_linkd ? renderMedia(post.Post.content_linkd) : ''}
            </div>
            <div>
            <span class="count">Likes : ${post.votes}</span>
            <div>
<button class="edit-button" id="edit-button">Edit</button>
<button class="delete-button" id="delete-button">Delete</button>
</div>
                </div>



`;
document.getElementById('delete-button').addEventListener('click', deletePost);

document.getElementById('edit-button').addEventListener('click', function() {
    window.location.href = 'http://127.0.0.1:5501/static/editPost.html';
});
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
async function deletePost() {
const postId = localStorage.getItem('post_id');
const token = localStorage.getItem('access_token');
if (!postId || !token) {
    alert('Post ID or token is missing. Redirecting to posts page.');
    window.location.href = 'http://127.0.0.1:5501/static/login.html';
    return;
}

try {
    const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete post. Please log in again.');
    }

    alert('Post deleted successfully.');
    window.location.href = 'http://127.0.0.1:5501/static/myAccount.html';
} catch (error) {
    console.error('Error deleting post:', error);
    alert('Something went wrong. Please try again later.');
}
}


fetchPost();