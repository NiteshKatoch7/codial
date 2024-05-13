const User = require('../models/user');
const env = require('../config/environment');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
          origin: env.codieal_env_url,
          methods: ["GET", "POST"]
        }
      });
    
    io.sockets.on('connection', ( socket ) => {
        // console.log('New connection Received', socket.id);

        socket.on('disconnect', ()=>{
          // console.log('socket disconnected!');
        })

        socket.on('join_room', function(data){
          // console.log('Joining request rec.', data);

          socket.join(data.chatroom);

          io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', function(data){
          // console.log(data);
          io.in(data.chatroom).emit('receive_message', data);
        });

        socket.on('chat_single', async function(data){
          let sender = await User.findOne({email: data.senderEmail});
          let senderId = sender._id;
          let senderName = sender.name;
          let friendId = data.friendId;
          let friendName = data.friendName;
          let chatroomName = `codiel-${[friendId, senderId].sort().join('-')}`;
          
          socket.join(chatroomName);

          io.in(chatroomName).emit('single_user_joined', {
            senderId,
            senderName,
            friendId,
            friendName,
            chatroomName
          })
        })
    });
}