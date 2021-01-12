const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Obtenir l'utilisateur et le salon en Url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join au salon
socket.emit('joinRoom', { username, room });

// Obtenir les salons et les users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message du server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll 
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Obtenir le message
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Effacons
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Sorti d'un message vers le DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Ajout d'un salon au DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Ajout des utilisateurs au DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }
