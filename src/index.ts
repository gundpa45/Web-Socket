import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let allSocket: User[] = [];

interface User {
  Socket: WebSocket;
  room: string;
}


wss.on(("connection"),(Socket)=>{
  Socket.on("message",(message)=>{
    // let parsedMessage:any;
    const parsedMessage =JSON.parse(message.toString())

    if(parsedMessage.type=="join"){

      console.log(" user joined  room " +parsedMessage.payload.roomId) 
      allSocket.push({
        Socket,
        room:parsedMessage.payload.roomId
      })
    }


    if(parsedMessage.type=="chat"){
      console.log(" user wnat to chat ")
      let currentUserRoom=null;
      for( let i=0;i<allSocket.length;i++){
        if(allSocket[i].Socket==Socket){
          currentUserRoom=allSocket[i].room
        }
      }


      for(let i=0;i<allSocket.length;i++){
        if(allSocket[i].room==currentUserRoom){
          allSocket[i].Socket.send(parsedMessage.payload.message)
        }
      }
    }
  })
})
