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
}, 1000);
let selectedFriendId = null;
let refreshInterval = null;
function scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function setActiveFriend(activeItem) {
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}
async function fetchFriends() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/friends/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch friends. Please log in again.');
        }
        const friends = await response.json();
        populateFriendList(friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        alert(error.message);
        window.location.href = 'http://127.0.0.1:5501/static/login.html';
    }
}

function populateFriendList(friends) {
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = '';
    friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.classList.add('friend-item');
        friendItem.innerHTML = `
            <h2>${friend.friend_details.name}</h2>

        `;
        friendItem.addEventListener('click', () => {
            openChatWindow(friend);
            setActiveFriend(friendItem);
        });
        friendList.appendChild(friendItem);
    });
}

async function openChatWindow(friend) {
    selectedFriendId = friend.friend_id;
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.innerHTML = `
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input class ="chat_box" id="chat-input">
            <input type="text" id="message-input" class ="message-box" placeholder="Type a message..." />
            <button class="send" onclick="sendMessage()">Send</button>
        </div>
    `;
    fetchMessages();
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    refreshInterval = setInterval(fetchMessages, 1000);
}

async function fetchMessages() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/chats/${selectedFriendId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
           Toastify({
                text: "Chat with your new friend",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                className: "info",
            }).showToast();
            throw new Error('Failed to fetch messages. Please try again.');
        }
        const messages = await response.json();
        populateMessages(messages);
        scrollToBottom();
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function populateMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    const currentUserId = localStorage.getItem('user_id');
    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');
        messageItem.classList.add(message.from_id === parseInt(currentUserId) ? 'sent' : 'received');
        messageItem.innerHTML = `
            <p><strong>${message.from_id === parseInt(currentUserId) ? 'You' : 'Friend'}:</strong> ${message.content}</p>
        `;
        chatMessages.appendChild(messageItem);
    });
}

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const content = messageInput.value;
    if (!content) return;

    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/chats/${selectedFriendId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) {
            throw new Error('Failed to send message.');
        }
        const message = await response.json();
        messageInput.value = '';
        fetchMessages();
    } catch (error) {
        console.error('Error sending message:', error);
        alert(error.message);
    }
}

fetchFriends();


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