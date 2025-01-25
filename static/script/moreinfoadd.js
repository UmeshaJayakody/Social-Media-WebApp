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
let priviouscover;
let priviousdp;
async function fetchDetails() {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');
    if (!user_id || !token) {
        alert('Post ID or token is missing. Redirecting to posts page.');
        window.location.href = 'http://127.0.0.1:5501/static/myposts.html';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/alternatives/${user_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post details. Please log in again.');
        }

        const data = await response.json();
        document.getElementById('user-introduction').value = data.introduction;
        document.getElementById('user-contact').value = data.contact_number;
        document.getElementById('user-address').value = data.address;
        document.getElementById('user-birthday').value = data.birthday;
        document.getElementById('user-social-link-1').value = data.social_media_link_1;
        document.getElementById('user-social-link-2').value = data.social_media_link_2;
        document.getElementById('user-social-link-3').value = data.social_media_link_3;
        priviouscover = data.background_photo;
        priviousdp = data.profile_photo;
    } catch (error) {
        console.error('Error fetching post details:', error);
        alert('Something went wrong. Please try again later.');
    }
}

async function saveuserDetails() {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    const introduction   = document.getElementById('user-introduction').value;
    const contact_number  =  document.getElementById('user-contact').value;
    const address   = document.getElementById('user-address').value;
    const birthday   = document.getElementById('user-birthday').value;
    const social_media_link_1  =  document.getElementById('user-social-link-1').value;
    const social_media_link_2   = document.getElementById('user-social-link-2').value;
    const social_media_link_3  =  document.getElementById('user-social-link-3').value;
    const mediaInput_dp = document.getElementById('user-dp');
    const mediaInput_cover = document.getElementById('user-cover');
    const mediaFile_dp = mediaInput_dp.files[0];
    const mediaFile_cover = mediaInput_cover.files[0];
    if(mediaFile_dp){
        try {
            profile_photo = await uploadMedia(mediaFile_dp); 
        } catch (error) {
            console.error('Error uploading media:', error);
            alert('Failed to upload media. Please try again later.');
            return;
        }
    }
    else{
        profile_photo = priviousdp;
    }
    if(mediaFile_cover){
        try {
            background_photo = await uploadMedia(mediaFile_cover); 
        } catch (error) {
            console.error('Error uploading media:', error);
            alert('Failed to upload media. Please try again later.');
            return;
        }
    }
    else{
        background_photo = priviouscover;
    }
    if (!user_id || !token) {
        alert('Post ID or token is missing. Redirecting to posts page.');
        window.location.href = 'http://127.0.0.1:5501/static/myposts.html';
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/alternatives", {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({profile_photo
                ,background_photo
                ,introduction
                ,contact_number
                ,address
                ,birthday
                ,social_media_link_1
                ,social_media_link_2
                ,social_media_link_3
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save post details. Please log in again.');
        }


        Toastify({
            text: 'updated successfully.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #4c4c4c, #4c4c4c)',
            stopOnFocus: true
        }).showToast();
    } catch (error) {
        console.error('Error saving post details:', error);
        alert('Something went wrong. Please try again later.');
    }
}

document.getElementById('save-button').addEventListener('click', saveuserDetails);
document.getElementById('account-delete').addEventListener('click', deleteaccount);
async function deleteaccount() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Post ID or token is missing. Redirecting to posts page.');
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/users`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete account. Please log in again.');
        }

        alert('Post deleted successfully.');
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Something went wrong. Please try again later.');
    }
}
fetchDetails();