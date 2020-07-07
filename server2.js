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

app.get('/', function(req, res) {
	res.sendfile("chess2.html");
});

users = [];

// if connection is recieved through socket check for data being sent 
io.on('connection', function(socket) {
	
	// take data and broadcast it to all clients 
	socket.on("broadcast",function(data){
		
		io.sockets.emit("update",data);
	
	});
	
   socket.on('setUsername', function(data) {
      console.log(data);
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
 
		 
		 con.connect(function(err) {
		
			
				var sql = "SELECT * FROM chats";
				con.query(sql, function (err, result) {
		
					socket.emit("showMessages",result);
			});
		});
		
		socket.emit('userSet', {username: data});

      }
   });
   
   socket.on('msg', function(data) {
	   
	   con.connect(function(err) {
			

			var sql = "INSERT INTO chats (username, message) VALUES ?";
			var values = [
			[data.user, data.message],
			];
			con.query(sql,[values], function (err, result) {
		});
	});

      //Send message to everyone
      io.sockets.emit('newmsg', data);
   });
   
});

http.listen(60276, function() {
   console.log('listening on localhost:60276');
});