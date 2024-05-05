class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBoxId = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        
        this.socket = io.connect('http://localhost:5000/');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self = this;

        this.socket.on('connect', function(){
            // console.log('connection estabished using sockets......!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codiel',
            })

            self.socket.on('user_joined', function(data){
                // console.log('User Joined: ', data);
                $('#send-chat-message').attr('data-chatroom', 'codiel');
            })
        });

        // Send Chat Messages on Codieal Chatroom
        $('#send-chat-message').click(function(e){
            let messageInput = $('#chat-message-input').val();
            let chatroom = $('#send-chat-message').data('chatroom');
            if(messageInput !== ""){
                self.socket.emit('send_message', {
                    message: messageInput,
                    chatroom: chatroom,
                    user_email: self.userEmail,
                })
                $('#chat-message-input').val("");
            }
        });

        self.socket.on('receive_message', function(data){
            //console.log(data)
            let newMessageDOMWrapper = $('<li class="chat">');
            let messageType = 'left-chat';

            if(data.user_email === self.userEmail){
                messageType = 'right-chat';
            }

            newMessageDOMWrapper.append($('<span>', {
                'html': data.message
            }));

            newMessageDOMWrapper.append($('<p>', {
                'html': data.user_email,
                'class': 'info'
            }));

            newMessageDOMWrapper.addClass(messageType);

            $('#chat-window-list').append(newMessageDOMWrapper);
            $('#user-chat-box').css('display', 'block');
        })

        // Make Personal Chat Room
        $('.friend-chat-btn').click(function(e){
            let friendId = $(this).data('friend-id');
            let friendName = $(this).data('friend-name');
            let senderEmail = self.userEmail;
            
            self.socket.emit('chat_single', {
                friendId,
                friendName,
                senderEmail,
            });

            self.socket.on('single_user_joined', function(data){
                $('#user-chat-box').css('display', 'block');
                $('#user-chat-box>.chat-header>h4').html(friendName);
                $('#send-chat-message').attr('data-chatroom', data.chatroomName);
            })
        });
    };
}