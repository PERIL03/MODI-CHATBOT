let currentConversationId = null;
let currentUserId = 'user_' + Date.now();
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});
function initializeApp() {
    createNewConversation();
    loadConversations();
}
function setupEventListeners() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const newChatBtn = document.getElementById('newChatBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const audioBtn = document.getElementById('audioBtn');
    messageForm.addEventListener('submit', handleSendMessage);
    newChatBtn.addEventListener('click', createNewConversation);
    voiceBtn.addEventListener('click', handleVoiceInput);
    audioBtn.addEventListener('click', handleAudioPlayback);
    messageInput.focus();
}
async function createNewConversation() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/chat/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUserId
            })
        });
        const data = await response.json();
        if (data.status === 'success') {
            currentConversationId = data.conversation_id;
            clearMessages();
            loadConversations();
            showWelcomeMessage();
            animateNewChat();
        }
    } catch (error) {
        console.error('Error creating conversation:', error);
        showError('Failed to create new conversation');
    }
}
async function loadConversations() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/chat/conversations?user_id=${currentUserId}`);
        const data = await response.json();
        if (data.status === 'success') {
            const conversationsList = document.getElementById('conversationsList');
            conversationsList.innerHTML = '';
            data.conversations.forEach((conv, index) => {
                const convItem = createConversationItem(conv);
                conversationsList.appendChild(convItem);
                anime({
                    targets: convItem,
                    opacity: [0, 1],
                    translateX: [-20, 0],
                    duration: 500,
                    delay: index * 100,
                    easing: 'easeOutQuad'
                });
            });
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}
function createConversationItem(conversation) {
    const item = document.createElement('div');
    item.className = 'conversation-item';
    if (conversation._id === currentConversationId) {
        item.classList.add('active');
    }
    const date = new Date(conversation.created_at).toLocaleDateString();
    item.innerHTML = `
        <div>Chat #${conversation._id.substring(0, 8)}</div>
        <div class="conversation-time">${date}</div>
    `;
    item.addEventListener('click', () => switchConversation(conversation._id, item));
    return item;
}
async function switchConversation(conversationId, element) {
    currentConversationId = conversationId;
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
    clearMessages();
    loadMessages();
    anime({
        targets: '.messages-container',
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}
async function handleSendMessage(e) {
    e.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (!message) return;
    showLoading(true);
    addMessageToUI(message, 'user');
    messageInput.value = '';
    try {
        const response = await fetch(`${window.API_BASE_URL}/chat/conversations/${currentConversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                sender: 'User'
            })
        });
        const data = await response.json();
        if (data.status === 'success') {
            addMessageToUI(data.bot_response, 'bot');
            if (data.audio_url) {
                playBotAudio(data.audio_url);
            }
            loadConversations();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToUI('Sorry bro, something went wrong! 😅', 'bot');
    } finally {
        showLoading(false);
        messageInput.focus();
    }
}
function addMessageToUI(text, sender) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
        <p>${escapeHtml(text)}</p>
        <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
    `;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    anime({
        targets: messageDiv,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutQuad'
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
async function loadMessages() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/chat/conversations/${currentConversationId}/messages`);
        const data = await response.json();
        if (data.status === 'success') {
            data.messages.forEach((msg, index) => {
                setTimeout(() => {
                    addMessageToUI(msg.content, msg.sender_type);
                }, index * 50);
            });
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}
function clearMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    anime({
        targets: '.message',
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
            messagesContainer.innerHTML = '';
            showWelcomeMessage();
        }
    });
}
function showWelcomeMessage() {
    const messagesContainer = document.getElementById('messagesContainer');
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'message bot-message';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
        <p>Yo bro! Welcome! Kya haal hai? Ready to chat? 🎉</p>
        <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
    `;
    welcomeDiv.appendChild(contentDiv);
    messagesContainer.appendChild(welcomeDiv);
    anime({
        targets: welcomeDiv,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutQuad'
    });
}
function handleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech Recognition not supported in your browser');
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; 
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.style.background = 'var(--accent-color)';
    voiceBtn.textContent = '🎤 Listening...';
    recognition.onstart = () => {
        console.log('Voice recognition started');
    };
    recognition.onend = () => {
        voiceBtn.style.background = '';
        voiceBtn.textContent = '🎤 Voice';
    };
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        if (transcript) {
            document.getElementById('messageInput').value = transcript;
        }
    };
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.style.background = '';
        voiceBtn.textContent = '🎤 Voice';
    };
    recognition.start();
}
function handleAudioPlayback() {
    const audioBtn = document.getElementById('audioBtn');
    const botMessages = document.querySelectorAll('.bot-message');
    if (botMessages.length === 0) {
        alert('No bot messages to play');
        return;
    }
    const lastBotMessage = botMessages[botMessages.length - 1];
    const messageText = lastBotMessage.querySelector('p').textContent;
    generateTTS(messageText, audioBtn);
}
async function generateTTS(text, button) {
    button.disabled = true;
    button.textContent = '🔊 Loading...';
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN'; 
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onend = () => {
            button.disabled = false;
            button.textContent = '🔊 Audio';
        };
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.error('TTS error:', error);
        button.disabled = false;
        button.textContent = '🔊 Audio';
    }
}
function playBotAudio(audioUrl) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioUrl;
    audioPlayer.play().catch(err => console.error('Audio playback error:', err));
}
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (show) {
        loadingIndicator.style.display = 'flex';
        anime({
            targets: loadingIndicator,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    } else {
        anime({
            targets: loadingIndicator,
            opacity: [1, 0],
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                loadingIndicator.style.display = 'none';
            }
        });
    }
}
function showError(message) {
    alert(`Error: ${message}`);
}
function animateNewChat() {
    anime({
        targets: '.bot-avatar-section',
        scale: [0.95, 1],
        opacity: [0.5, 1],
        duration: 500,
        easing: 'easeOutElastic(1, .6)'
    });
    anime({
        targets: '.messages-container',
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}