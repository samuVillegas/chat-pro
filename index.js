const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();

//Libraries WebSocket
const { createServer } = require("http");
const { Server } = require("socket.io");

require('dotenv').config();

//Middewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'static')));

//variables
app.set('PORT', process.env.PORT || 4050);


const httpServer = createServer(app);
const io = new Server(httpServer,{/* Opciones */})

app.get('', (req,res) => {
    res.sendFile(path.join(__dirname,"static/registration.html"))
})

io.on("connection", socket => {
    socket.on('room',(room)=>{
        socket.join(room);
    })

    socket.on('chat:message', data => {
        //Compartir mensaje a otros usuarios
        //io.emit('chat:message',data);
        io.to(data.room).emit("chat:message",data);
    })
    

    socket.on("disconnect", () => {
        console.log('Me desconecté',socket.id); // false
    });
});

httpServer.listen(app.get('PORT'), () => {
    console.log(`server running in port: ${app.get('PORT')}`)
})