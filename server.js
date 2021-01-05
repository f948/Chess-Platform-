var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var roomExists=false;
var roomno = 0;
var chats =[];
var connectedUsers = {};
var playerNum=2;
var socketIds = [];
var connectedOnline=false;


const port = process.env.PORT || 3000

app.get('/', function(req, res) {
	
	res.sendfile("computerchess.html");
	
});

app.get('/computerchess.html', function(req, res) {
	
	res.sendfile("computerchess.html");

});

app.get('/onlinechess.html', function(req, res) {
	
	connectedOnline=true;
	
	res.sendfile("onlinechess.html");
	
});

// if connection is recieved through socket check for data being sent 
io.on('connection', function(socket) {
		
		var i;
		
		if(connectedOnline){
			
			if(playerNum%2==0){
				roomno++;
			}
	
			socket.join("room-"+roomno);
			socket.emit("connectToRoom",roomno);
			connectedUsers[socket.id]=roomno;
		
			socketIds.push(socket.id);
		
			for(i=0;i<=chats.length-1;i++){
		
				if(chats[i].room == roomno){
					roomExists=true;
				}
		
			}
	
			if(!roomExists){
				chats.push({room:roomno,messages:[]});
			}
	
			roomExists=false;
	
			if(playerNum%2==1){
				socket.emit("setSide","black");
				io.sockets.in("room-"+roomno).emit("startGame");
			
			}
			else if(playerNum%2==0){
				socket.emit("setSide","white");
			}
		
	
			playerNum++;
	
			for(i=0;i<=chats.length-1;i++){
				if(chats[i].room == roomno){
					socket.emit("showMessages",chats[i].messages);
				}
			}
	
		}
		
		connectedOnline=false;
		
	socket.on("disconnect",function(){
		
		var i;
		
		for(i=0;i<=chats.length-1;i++){
			if(chats[i].room == connectedUsers[socket.id]){
				chats[i].messages=[];
			}
		}
		
		var players=0;
		
		for(i=0;i<=socketIds.length-1;i++){
			
			if(connectedUsers[socketIds[i]] == connectedUsers[socket.id]){
				
				players++;
				socketIds[i]="";
				connectedUsers[socketIds[i]] = "disconnected";
			}
		}
		
		if(players == 1){
			
			playerNum--;
				
			
		}
		
		else if(players == 2){
			
			io.sockets.in("room-"+connectedUsers[socket.id]).emit("disconnection",socket.id);
		}
		
	});
	
	// take data and broadcast it to all clients 
	socket.on("broadcast",function(data){
		
		io.sockets.in("room-"+data.room).emit("update",data);
		
	});
	
	
   socket.on('msg', function(data) {
	   
	   var i;
	   
	   for(i=0;i<=chats.length-1;i++){
		   if(chats[i].room == data.room){
			   chats[i].messages.push({player:data.player,message:data.message});
		   }
	   }
	   
      //Send message to everyone
      io.sockets.in("room-"+data.room).emit('newmsg', {player:data.player,message:data.message});
   });
   
});

http.listen(port, function() {
   console.log('listening on localhost:'+port);
});
