const express = require('express');
const socketPort = 3000;
const serverPort = 81;
const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});


// Chat application part

const app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('chat.ejs', { server: `http://${req.get('host').split(":")[0]}:${socketPort}` });
});

app.listen(serverPort);
console.log("Chat server started on localhost: " + serverPort);


//Socket Part

var allClients = [];

io.on("connection", (socket) => {
    console.log(allClients.length);
    socket.on("name", (data) => {
        socket.name = data;
        allClients.push(socket);
        allClients.forEach((client) => {
            if (client == socket) {
                socket.emit("message", "Welcome " + data);
            } else {
                client.emit("message", socket.name + " joined the chat!");
            }
        });
    });

    socket.on("disconnect", (con) => {
        let i = allClients.indexOf(socket);
        let name = allClients[i].name;
        allClients.splice(i, 1);

        allClients.forEach((client) => {
            client.emit("message", name + " has left the chat!");
        });
    });

    socket.on("clientmsg", (data) => {
        allClients.forEach((client) => {
            console.log(client.name);
            client.emit("message", socket.name + ": " + data);
        });
        console.log(socket.name + ": " + data);
    });
});

http.listen(socketPort, () => {
    console.log("Socket started on localhost: " + socketPort);
});