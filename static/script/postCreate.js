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

       
async function uploadMedia(file) {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`http://127.0.0.1:8000/uploadfile`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload media.');
    }

    const result = await response.json();
    return result.filename; 
}

async function savePostDetails() {
    const token = localStorage.getItem('access_token');
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const mediaInput = document.getElementById('post-media');
    const mediaFile = mediaInput.files[0]; 

    if (!token) {
        Toastify({
            text: "Token is missing. Redirecting to login page.",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", 
            position: 'right', 
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            stopOnFocus: true, 
        }).showToast();
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }

    let content_linkd = '';
    if (mediaFile) {
        try {
            content_linkd = await uploadMedia(mediaFile); 
        } catch (error) {
            console.error('Error uploading media:', error);
            alert('Failed to upload media. Please try again later.');
            return;
        }
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content, content_linkd })
        });

        if (!response.ok) {
            throw new Error('Failed to create post. Please log in again.');
        }
        console.log(content_linkd);
        alert('Post created successfully.');
        window.location.href = 'http://127.0.0.1:5501/static/myposts.html';
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Something went wrong. Please try again later.');
    }
}

document.getElementById('save-button').addEventListener('click', savePostDetails);