const express = require('express');
const http = require('http');
const socketIo= require('socket.io');
const cors = require('cors');
const pool = require ('./db');
require('dotenv').config();

const authRoutes= require('./routes/authRoutes');
const chatRoutes= require('./routes/chatRoutes');
const { text } = require('stream/consumers');

const app=express();
const server=http.createServer(app);
const io=socketIo(server,{cors: {origin:'*'}});

app.use(cors());
app.use(express.json());

// Add a simple root route
app.get('/', (req, res) => {
  res.json({ message: 'Chat API is running' });
});

app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);

io.on('connection',(socket)=>{
    socket.on('joinmessage',(room)=>{
        socket.json(room);
    })
    socket.on('chatMessage',async({token , room ,text})=>{
        try{
            const jwt=require('jsonwebtoken');
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            const userId=decoded.userid;

            await pool.query('INSERT INTO messages (user_id,room,text)VALUES(?,?,?)',[userId,room,text])
            io.to(room).emit('chatMessage',{userId,text,room});

        }catch{
            socket.emit('error','authintication failed');
        }
    });
});



const PORT= process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`Backend running on http://localhost:${PORT}`);
});