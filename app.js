var express = require("express");
var app = express();

// import the socket.io library
var io = require("socket.io")();
// instantiate the socket.io library right away with the () method -> makes it run

//defining port 
const port = process.env.PORT || 3000;

// tell express where our static files are (js, images, css etc)
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//listening on defined port, sending to console log
const server = app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

//attach our server to our app
io.attach(server);

//opening the connection (socket)
io.on("connection", function (socket) {

  socket.emit("connected", {
    sID: socket.id,
  });
  //takes the data and then puts it out
  console.log("A new User has joined the chat using socket id" + socket.id);

//this emits hasJoined event to the socket/server
  io.emit("hasJoined", {
    notifications: "A new user has joined"
  });



  //listening for incoming msgs in console
  socket.on("chat message", function (msg) {
    console.log("message: ", msg, "socket:", socket.id);

    // tell the connection manager (io) to send this message to everyone
    // send the message to everyone connected to the app
    io.emit("chat message", {
      id: socket.id,
      message: msg
    });
  });

  //listening for typing data/event and emitting
  socket.on("typing", data => {
    io.emit("typing", data);
  });

  //listens to stoptyping event and emitting
  socket.on("stoptyping", () => {
    io.emit("stoptyping");
  });

  //disconnect function, on disconnect log to console
  socket.on("disconnect", function (socket) {
    console.log("a user has disconnected");

    //listening for user disconnected and emitting
    io.emit("hasLeft", {
      notifications: "A user has left the conversation"
    });
  });
});