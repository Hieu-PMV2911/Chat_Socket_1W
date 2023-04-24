const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
// const chats = require('./data/data');
const connectDB = require('./config/connectDB');
const userRouter = require('./routers/userRouter');
const chatRouter = require('./routers/chatRouter');
const messRouter = require('./routers/messRouter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
port = process.env.PORT || 8080;
app.use(cookieParser());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messRouter);

// connectDB();

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
let users = [];

// socket.io
// const io = require('socket.io')(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: 'http://localhost:3001',
//   },
// });

// io.on('connection', (socket) => {
//   console.log("user connect: ",socket.id)

//   socket.on('chat message', (msg) => {
//     io.emit('chat message', msg);
//   });


  // socket.on('joinUser', (user) => {
  //   users.push({
  //     id: user._id,
  //     socketId: socket.id,
  //     followers: user.followers,
  //   });
  // });

  // socket.on('disconnect', () => {
  //   const data = users.find((user) => user.socketId === socket.id);
  //   if (data) {
  //     const clients = users.filter((user) =>
  //       data.followers.find((item) => item._id === user.id)
  //     );

  //     if (clients.length > 0) {
  //       clients.forEach((client) => {
  //         socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id);
  //       });
  //     }

  //     if (data.call) {
  //       const callUser = users.find((user) => user.id === data.call);
  //       if (callUser) {
  //         users = EditData(users, callUser.id, null);
  //         socket.to(`${callUser.socketId}`).emit('callerDisconnect');
  //       }
  //     }
  //   }

  //   users = users.filter((user) => user.socketId !== socket.id);
  // });

  // // Notification
  // socket.on('createNotify', (msg) => {
  //   const client = users.find((user) => msg.recipients.includes(user.id));
  //   client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg);
  // });

  // socket.on('removeNotify', (msg) => {
  //   const client = users.find((user) => msg.recipients.includes(user.id));
  //   client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg);
  // });

  // // Message
  // socket.on('addMessage', (msg) => {
  //   const user = users.find((user) => user.id === msg.recipient);
  //   user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg);
  // });

  // // Check User Online / Offline
  // socket.on('checkUserOnline', (data) => {
  //   const following = users.filter((user) =>
  //     data.following.find((item) => item._id === user.id)
  //   );
  //   socket.emit('checkUserOnlineToMe', following);

  //   const clients = users.filter((user) =>
  //     data.followers.find((item) => item._id === user.id)
  //   );

  //   if (clients.length > 0) {
  //     clients.forEach((client) => {
  //       socket
  //         .to(`${client.socketId}`)
  //         .emit('checkUserOnlineToClient', data._id);
  //     });
  //   }
  // });

  // // Call User
  // socket.on('callUser', (data) => {
  //   users = EditData(users, data.sender, data.recipient);

  //   const client = users.find((user) => user.id === data.recipient);

  //   if (client) {
  //     if (client.call) {
  //       socket.emit('userBusy', data);
  //       users = EditData(users, data.sender, null);
  //     } else {
  //       users = EditData(users, data.recipient, data.sender);
  //       socket.to(`${client.socketId}`).emit('callUserToClient', data);
  //     }
  //   }
  // });

  // socket.on('endCall', (data) => {
  //   const client = users.find((user) => user.id === data.sender);

  //   if (client) {
  //     socket.to(`${client.socketId}`).emit('endCallToClient', data);
  //     users = EditData(users, client.id, null);

  //     if (client.call) {
  //       const clientCall = users.find((user) => user.id === client.call);
  //       clientCall &&
  //         socket.to(`${clientCall.socketId}`).emit('endCallToClient', data);

  //       users = EditData(users, client.call, null);
  //     }
  //   }
  // });
// });
