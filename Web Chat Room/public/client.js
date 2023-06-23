// Client side logic of web chat app
// Base code gotten from https://github.com/alligatorio/Chat-Example

const socket = io()

//get all of our elements
const chat = document.querySelector('#chat')
const form = document.querySelector('form')
var name = ""
const message = form.message
const send = form.send
var color = "default"



form.addEventListener('submit', e => {
    e.preventDefault()

    //disable while the message is being sent.
    send.classList.remove('bg-purple-700')
    send.classList.add('cursor-not-allowed', 'bg-purple-500')

    socket.emit('sendMessage', {
        name: this.name,
        message: message.value,
        time: "",
        color: this.color
    })

    message.value = ''
    message.focus()
})

//Just creating a new element for our message and appending it to the chat and re-enabling the send button.
socket.on('showMessage', message => {
    const newMessage = document.createElement('div')
    const user = document.createElement('h3')
    const text = document.createElement('p')

    newMessage.classList.add('flex', 'flex-row', 'items-center', 'mt-5')
    user.classList.add('bg-blue-600', 'p-3', 'mr-1', 'w-60', 'rounded')
    user.innerHTML = message.name
    if(message.color !== "default"){
        user.style.backgroundColor = "#" + message.color
    }
    text.classList.add('break-words', 'w-1/2')
    text.innerHTML = message.time + "<br>" + message.message

    newMessage.id = "MES" + message.name;
    newMessage.appendChild(user)
    newMessage.appendChild(text)
    if(message.name === this.name){
        newMessage.style.fontWeight = "700";
    }
    chat.appendChild(newMessage)

    //Undisable button after message is received
    send.classList.remove('cursor-not-allowed', 'bg-purple-500')
    send.classList.add('bg-purple-700')
})

socket.on('welcome', message => {
    const newMessage = document.createElement('div')
    const text = document.createElement('h1')
    this.name = message.name

    text.innerHTML = "Welcome " + message.name

    text.id = "welcomeMessage";
    newMessage.appendChild(text)
    welcome.appendChild(newMessage)

    // Setting up all the previous messages of the chat room
    for (mes of message.mLog){
        const messages = document.createElement('div')
        const newMes = document.createElement('h3')
        const text = document.createElement('p')   

        messages.classList.add('flex', 'flex-row', 'items-center', 'mt-5')
        newMes.classList.add('bg-blue-600', 'p-3', 'mr-1', 'w-60', 'rounded')
        newMes.innerHTML = mes.name 
        newMes.style.backgroundColor = "#" + mes.color;
        text.classList.add('break-words', 'w-1/2')
        text.innerHTML = mes.time + "<br>" + mes.message

        messages.id = "MES" + mes.name;
        messages.appendChild(newMes)
        messages.appendChild(text)
        chat.appendChild(messages)
    }

    const userNames = document.createElement('div')

    for (uName of message.users){
        const userName = document.createElement('h1')   
        userName.id = uName;
        userName.innerHTML = uName;
        userName.classList.add('break-words', 'bg-blue-600', 'p-3', 'mr-10', 'mt-1', 'w-full', 'rounded')
        if(uName in message.uColors){
            userName.style.backgroundColor = "#" + message.uColors[uName];
        }
        userNames.appendChild(userName)
    }

    users.appendChild(userNames)
})

socket.on('addUser', message => {
    const userName = document.createElement('h1')
    userName.id = message.name
    userName.innerHTML = message.name
    userCount.innerHTML = "Online Users: " + message.count
    userCount.classList.add('bg-blue-800', 'p-3', 'mr-10', 'w-full', 'sm:w-1/2')
    userName.classList.add('break-words', 'bg-blue-600', 'p-3', 'mr-10', 'mt-1', 'w-full', 'rounded')
    if(message.name === this.name){
        userName.style.fontWeight = "700";
    }
    if(message.color !== "default"){
        userName.style.backgroundColor = "#" + message.color;
    }
    users.appendChild(userName)
})

socket.on('remUser', message => {
    userCount.innerHTML = "Online Users: " + message.count;
    var item = document.getElementById(message.name);
    item.parentNode.removeChild(item);
})

socket.on('changeNick', message => {
    if(this.name !== null){
        document.cookie = this.name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    this.name = message.name;
    var item = document.getElementById("welcomeMessage");
    item.innerHTML =  "Welcome " + this.name;
    document.cookie = this.name + "=" + this.color + ";" + "max-age=180;";
})

socket.on('updateNick', message => {
    var item = document.getElementById(message.oldName);
    item.innerHTML = message.name;
    item.id = message.name;
})

socket.on('badCommand', message => {
    alert(message.message);
})

socket.on('changeColor', message => {
    this.color = message.color;
    document.cookie = this.name + "=" + message.color + ";" + "max-age=180;";
})

socket.on('updateColor', message => {
    var item = document.getElementById(message.name);
    item.style.backgroundColor = "#" + message.color;
})

socket.on('cookie', message => {
    document.cookie = message.name + "=" + this.color + ";" + "max-age=180;";
})

socket.on('requestCookies', message => {
    socket.emit("getCookies", document.cookie);
})
