const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
const path = require('path')

require('dotenv').config()

//db
require('./db/mongoose')

//import routes
const auth = require('./routes/auth')
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')

//app
const app = express()

//middlewares
app.use(bodyParser.json())
app.use(expressValidator());
app.use(cors());

// console.log(path.join(__dirname, 'public'))
app.use(express.static(path.join(__dirname, 'public')));


//routes middleware
app.use(auth)
app.use(userRoutes)
app.use(chatRoutes)

const PORT = process.env.PORT;

//socket configuration
const server = http.createServer(app)
const io = socketio(server)

const Chat = require('./models/chat')

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (data, callback) => {
        console.log(data)
        socket.join(data._id)
    })

    socket.on('sendMessage', (message, callback) => {
        // const user = getUser(socket.id)
        // io.to(user.room).emit('message', generateMessage(user.username, message))

        const chat = new Chat(message);
        chat.save()
            .then( data => {
                // io.emit('message', generateMessage('User', message.message))
                // io.to(socket.id).emit('message', chat)

                Chat.getMessagesByUsers(message.from, message.to).then(messages => {
                    // io.emit('message', messages)
                    // io.to(socket.id).emit('message', message)

                    io.sockets.in(message.to).emit('message', messages);

                    // io.sockets.in(message.to).emit('message', messages);
                    callback(null, messages)
                });
            })
            .catch(error => {
                callback('Error in saving chat.')
            })
    })

    socket.on('disconnect', () => {
        console.log('connection closed')
    })
})


server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})