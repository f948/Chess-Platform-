# Online multiplayer chess-

Description: A multiplayer chess game that can support infinite players who can all interact in the same game.The game also has a built in chat.The server uses Node.js modules http.express, and sockets.io to communicate with the clients.

# Required 
  Node.js installed, including express, and sockets.io installed in the same folder as your client and server side code 
  
# To make the code work

You will need to have the client side and server side code in the same folder.
In addition you will need to run the server on a port on your computer that is not currently listening.
You will also use the windows command prompt to navigate to the directory containing your server and client files and 
type"nodemon server.js" to start the server. 

# Known bugs 

In order to win you will have to make a move to capture the opponent's king directly.

There is no warning to show a player is in check

No En Passant pawn rule 

When a pawn becomes a passed pawn the computer chooses a random number 1,2,3, or 4 and decides wether the pawn becomes a queen, rook, knight, or bishop

# LICENSE:
NOT FOR COMMERCIAL USE If you intend to use any of my code for commercial use please contact me and get my permission. If you intend to make money using any of my code please ask my permission.

