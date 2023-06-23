// Server side logic of web chat app
// Base code gotten from https://github.com/alligatorio/Chat-Example

const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')

const app = express()

const publicDirectoryPath = path.join(__dirname, './public')
app.use(express.static(publicDirectoryPath))

var cookieParser = require('socket.io-cookie');
const server = http.createServer(app) //io requires raw http
const io = socketio(server)

io.use(cookieParser);

const colorArray = ["Blue", "Pink", "Purple", "Green", "Yellow", "Cyan"]
const animalArray = ["Rhino", "Baboon", "Anteater", "Caribou", "Bear", "Mouse"]
var numUsers = 0;
var userList = [];
var userColorDict = {}; 
var messageLog = [];
var cookieList = [];

io.on('connection', socket => {
    

    // On new user connection increase user count by 1 and assign them a random nickname
    numUsers = numUsers + 1;
    socket.username = randColor() + randAnimal() + addUser();
    // Ensuring no duplicate usernames
    while(userList.includes(socket.username)){
        socket.username = randColor() + randAnimal() + addUser();
    }
    // Emits welcome event for new user and adds their username to the username list
    socket.emit("welcome", { name: socket.username, users: userList, mLog: messageLog, uColors: userColorDict });
    // This next section is for checking cookies upon login, if cookies exist they will be given to the new user
    socket.emit("requestCookies");
    socket.on("getCookies", message => {
        var ca = message.split(";")
        var colorCookie = 'default'
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            if (c.charAt(0) === ' ') {
              ca[i] = c.slice(1);
            }
        }

        if (message.length > 0) {
            var i = 0;
            while(i < ca.length && userList.includes(ca[i].split("=")[0])){
                i++;
            }
            if(i !== ca.length){
                socket.username = ca[i].split("=")[0];
                colorCookie = ca[i].split("=")[1];
                if(colorCookie !== "default") {
                    userColorDict[socket.username] = colorCookie;
                }
                socket.emit('changeColor', { color: colorCookie });
                socket.emit('changeNick', { name: socket.username });
            }
        }
        socket.emit("cookie", { name: socket.username });
        userList.push(socket.username);
        // Emits to everyone to show the new user has joined and update the user count and list on the user screens
        io.emit("showMessage", { name: socket.username, message: socket.username + ' HAS JOINED', time: getTime(), color:"default" });
        messageLog.push({ name: socket.username, message: socket.username + ' HAS JOINED', time: getTime(), color: "default" });
        io.emit("addUser", { name: socket.username, count: numUsers, color: colorCookie });
    })
    

    // Handling event of user sending message to the chat, gets current time for timestamp
    socket.on('sendMessage', message => {
        if(message.message.slice(0,6) === "/nick "){
            // Taking character 6 onwards of the message, which will be the new nickname
            socket.username = message.message.slice(6);
            if(!userList.includes(socket.username)){
                // Emmiting to the user changing nicknames to update unique aspects of their page
                socket.emit('changeNick', { name: socket.username });
                // Emmiting to all users to update their user list to the new nickname and also emmiting the 
                // message of the user having changed nicknames
                io.emit('updateNick', { name: socket.username, oldName: message.name });
                io.emit("showMessage", { name: socket.username, message: message.name + ' HAS CHANGED NICKNAME TO ' + socket.username, time: getTime(), color: message.color });
                // Adding message of user changing nicknames to message log
                messageLog.push({ name: socket.username, message: message.name + ' HAS CHANGED NICKNAME TO ' + socket.username, time: getTime(), color: message.color });
                // Changing username in userList
                var index = userList.indexOf(message.name);
                if (index !== -1) {
                    userList[index] = socket.username;
                }
                // Change the color dictionary entry to be for the nickname
                if (message.color !== "default"){
                    userColorDict[socket.username] = userColorDict[message.name];
                    delete userColorDict[message.name];
                }
            }
            else {
                // Tell user username is taken
                socket.emit('badCommand', { message: "Nickname is already taken, choose another" });
            }
            
        }
        // Handling if the user is trying to change their color
        else if(message.message.slice(0,11) === "/nickcolor "){
            const test = message.message.slice(11);
            // Making sure the RRGGBB value is valid
            if(parseInt(test, 16).toString(16) === test.toLowerCase()){
                socket.emit('changeColor', { color: test });
                io.emit('updateColor', { name: message.name, color: test });
                userColorDict[message.name] = test;
            }
            else {
                // Emit error to user so they fix their rgb value
                socket.emit('badCommand', { message: "Your rgb was incorrect, make sure it is only of the form: /nickcolor <RRGGBB>" });
            }
            
        }
        else if(message.message.slice(0,1) === "/"){
            // Tell user their slash command was incorrect
            socket.emit('badCommand', { message: "Your / command was incorrect, make sure it is of the form: /nick <nickname> " });
        }
        else {
            message.time = getTime();
            message.color = message.color;
            io.emit('showMessage', message);
            messageLog.push(message);
        }
    })

    socket.on('disconnect', message => {
        disName = socket.username;
        io.emit("showMessage", { name: disName, message: disName + ' HAS LEFT', time: getTime(), color: getColor(disName) });
        messageLog.push({ name: disName, message: disName + ' HAS LEFT', time: getTime(), color: getColor(disName) });
        userList = userList.filter( function(value) { return value !== disName});
        delete userColorDict[disName];
        numUsers = numUsers - 1;
        io.emit("remUser", { name: disName, count: numUsers, });
    })
})

const port = process.env.PORT || 3000
server.listen(port, () => console.log('Server is running...'))

function randColor () {
    return colorArray[Math.floor(Math.random() * colorArray.length)];
}

function randAnimal () {
    return animalArray[Math.floor(Math.random() * animalArray.length)];
}

function addUser () {
    return Math.floor(Math.random() * numUsers * 10);
}

function removeUser () {
    numUsers -= 1;
    return "";
}

function getTime() {
    var today = new Date();
    var hours =  today.getHours();
    var minutes = today.getMinutes();
    if(hours < 10) {
        hours = "0" + hours;
    }
    else if(minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

function getColor(uName) {
    if(uName in userColorDict) {
        return userColorDict.uName;
    }
    else {
        return "default";
    }
}

function getCookie(cname, cookies) {
    var name = cname + "=";
    var ca = cookies.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }