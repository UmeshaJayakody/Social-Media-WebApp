
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

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function handleSocialLogin(provider) {
    alert(`${provider} comming soon`);
}

function handleForgotPassword() {
    alert('comming soon');
}

function handleSignUp() {
    window.location.href = 'http://127.0.0.1:5501/static/register.html';
    
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

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        });
        const result = await response.json();
        if (response.ok) {
            Toastify({
                text: "Login successful! Redirecting...",
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right", 
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true 
            }).showToast();
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('user_id', result.user_id);
            window.location.href = 'http://127.0.0.1:5501/static/posts.html';
        } else {
            Toastify({
                text: 'Login failed: ' + result.detail,
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right", 
                backgroundColor: "rgba(253, 19, 39, 0.8)", 
                stopOnFocus: true 
            }).showToast();
        }
    } catch (error) {
        console.error('Error during login:', error);
        Toastify({
            text: 'An error occurred during login. Please try again.',
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right", 
            backgroundColor: "rgba(255, 0, 21, 0.8)", 
            stopOnFocus: true 
        }).showToast();
    }
});