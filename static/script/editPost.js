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
async function fetchPostDetails() {
    const postId = localStorage.getItem('post_id');
    const token = localStorage.getItem('access_token');
    if (!postId || !token) {
        alert('Post ID or token is missing. Redirecting to posts page.');
        window.location.href = 'http://127.0.0.1:5501/static/myposts.html';
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
            throw new Error('Failed to fetch post details. Please log in again.');
        }

        const data = await response.json();
        const post = data.Post;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-content').value = post.content;
        console.log(post);
    } catch (error) {
        console.error('Error fetching post details:', error);
        alert('Something went wrong. Please try again later.');
    }
}

async function savePostDetails() {
    const postId = localStorage.getItem('post_id');
    const token = localStorage.getItem('access_token');
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!postId || !token) {
        alert('Post ID or token is missing. Redirecting to posts page.');
        window.location.href = 'http://127.0.0.1:5501/static/myposts.html';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
            throw new Error('Failed to save post details. Please log in again.');
        }

        alert('Post updated successfully.');
        window.location.href = 'http://127.0.0.1:5501/static/post.html';
    } catch (error) {
        console.error('Error saving post details:', error);
        alert('Something went wrong. Please try again later.');
    }
}

document.getElementById('save-button').addEventListener('click', savePostDetails);

fetchPostDetails();