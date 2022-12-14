const express = require('express');
const { Socket } = require('socket.io');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const {  v4: uuidv4} = require('uuid');
const cors = require('cors')


app.use(cors())
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res)=> {
    res.send(`https://psi-stream.herokuapp.com/${uuidv4()}`)
});

app.get('/:room', (req, res)=> {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected',( userId));

        socket.on('disconnect', ()=> {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(port, ()=> {
    console.log('servidor online');
});