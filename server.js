var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chats"
});

var users = [];
var roomno = 0;
var clients=0;
var command 
var date;

const port = process.env.PORT || 3000

app.get('/', function(req, res) {
	
	if(clients<50){
		res.sendfile("chess.html");
	}
	else if(clients>=50){
		res.send("Too many connected users");
	}
});

// if connection is recieved through socket check for data being sent 
io.on('connection', function(socket) {
	
	if(clients%2==0){
		roomno++;
	}

	socket.join("room-"+roomno);
	socket.emit("connectToRoom",roomno);
	
	clients++;
	
	// take data and broadcast it to all clients 
	socket.on("broadcast",function(data){
		
		io.sockets.in("room-"+data.room).emit("update",data);
	
	});
	
   socket.on('setUsername', function(data) {
   
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
 
		 
		 con.connect(function(err) {
		
				command = "SELECT * FROM chats";
				con.query(command, function (err, result) {
		
					socket.emit("showMessages",result);
			});
		});
		
		socket.emit('userSet', {username: data});

      }
   });
   
   socket.on('msg', function(data) {
	   
	   con.connect(function(err) {
			

			command = "INSERT INTO chats (username, message, date) VALUES ?";
			var values = [
			[data.user, data.message, data.date],
			];
			con.query(command,[values], function (err, result) {
		});
	});

      //Send message to everyone
      io.sockets.emit('newmsg', data);
	  
   });
   
});

http.listen(port, function() {
   console.log('listening on localhost:'+port);
});
