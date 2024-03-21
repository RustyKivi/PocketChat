// Version 0.0.1
const socket = io();

socket.on('chat message', function(message) {
    console.log(message);
    renderMessage(message.sender, message.content, message.time);
});

const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        message={
            content:input.value
        }
        socket.emit('chat message', message);
        input.value = '';
    }
});