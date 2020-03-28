// import the component
import ChatMessage from './modules/ChatMessage.js';

const socket = io();

// the packet is whatever data we send through with the connect event
// from the server

// data destructuring
function logConnect({sID}) { 
    console.log(sID);
    vm.socketID = sID;
}

//this is the disconnect function
function logDisconnect({sID}) { 
    console.log(sID);
    vm.socketID = sID;
}

//notification/announcement function
function announcement({notifications}){
    vm.notifications.push(notifications);
}

//appends/push message through the server to show on screen
function appendMessage(message) {
    vm.messages.push(message);
}

// create Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        notification: "",
        notifications: [],
        typing: false,
        users: [],
        messages: []

    },
    watch: {
        message(value) {
          value ? socket.emit('typing', this.nickname) : socket.emit('stoptyping');
        }
      },
    
      created() {
        socket.on('typing', (data) => {
          console.log(data);
          this.typing = data || 'Anonymous';
        });
        socket.on('stoptyping', () => {
          this.typing = false;
        });
      },
    
    methods: {
        dispatchMessage() {
            // emit message event to the server from the client side so it can send to anyone who is connected
            // the double pipe || is an "or" operator
            // if the first value is set, use it. else use
            // whatever comes after the "or" operator
            socket.emit('chat message', { content: this.message, name: this.nickname || "Anonymous User"});

            // reset the message field
            this.message = "";

        },
        isTyping() {
          socket.emit('typing', this.nickname);
        },
        
    },
    components: {
        newmessage: ChatMessage
    }
}).$mount(`#app`);

//built in variables to use for socket
socket.on('connected', logConnect);
socket.on('disconnected', logDisconnect);

socket.on('hasJoined', announcement);
socket.on('hasLeft', announcement);

socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', appendMessage);