//connection completed between client and server through socket.io js file which we used in head tag
const socket = io('http://localhost:8000');

// Get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');//any messages we have to keep in this container

// Audio that will play on receiving messages
var audio = new Audio('notification.mp3');

// This function is to write on app if any new user joins. message is what needs to write and position is left or right on App
// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');//we can also write by using innerhtml
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
//emit means we are sending to nodeserver/server. If we write emit on server(index.js), it means we are sending from server to client
socket.emit('new-user-joined', name); //this name will be passed to the new-user-joined event on server


// If user-joined event trigger from server, we will write on the chat app. For that we will create one function called append
// If a new user joins, receive his/her from the server

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

//In server side we have handled the data as an array. It means for receive event, we are taking both the message and user name, that's y data.message & data.name
// If server sends a message , receive it
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left-the-chat', name => {
    append(`${name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); // if we click on submit, page will not reload
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';//to make input box empty after typing
})