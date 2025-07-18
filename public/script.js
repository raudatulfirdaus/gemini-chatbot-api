// script.js

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

function addMessageToHistory(message, sender) {
    const msgDiv = document.createElement('div');
    if (sender === 'user') {
        msgDiv.className = 'flex justify-end';
        msgDiv.innerHTML = `<div class="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs break-words">${message}</div>`;
    } else {
        msgDiv.className = 'flex justify-start';
        msgDiv.innerHTML = `<div class="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 max-w-xs break-words">${message}</div>`;
    }
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

chatForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessageToHistory(message, 'user');
    userInput.value = '';
    userInput.focus();

    // Tampilkan loading sementara
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'flex justify-start';
    loadingDiv.innerHTML = `<div class="bg-gray-200 text-gray-400 rounded-lg px-4 py-2 max-w-xs break-words italic">Mengetik...</div>`;
    chatHistory.appendChild(loadingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        chatHistory.removeChild(loadingDiv);
        if (response.ok) {
            addMessageToHistory(data.message, 'bot');
        } else {
            addMessageToHistory(data.error || 'Terjadi kesalahan.', 'bot');
        }
    } catch (error) {
        chatHistory.removeChild(loadingDiv);
        addMessageToHistory('Gagal terhubung ke server.', 'bot');
    }
}); 