import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let allSocket: { Socket: WebSocket; room: string }[] = [];

interface User {
  Socket: WebSocket;
  room: string;
}

wss.on("connection", (Socket) => {
  Socket.on("message", (message) => {
    const parseMessage = JSON.parse(message.toString());

    // ✅ FIXED condition
    if (parseMessage.type === "join") {
      allSocket.push({
        Socket,
        room: parseMessage.payload.roomId
      });
    }

    if (parseMessage.type === "chat") {
      // ✅ FIXED: get the room of the sender
      let currentuserRoom: string | null = null;
      for (let i = 0; i < allSocket.length; i++) {
        if (allSocket[i].Socket === Socket) {
          currentuserRoom = allSocket[i].room;
          break;
        }
      }

      // ✅ Only proceed if room is found
      if (currentuserRoom) {
        for (let i = 0; i < allSocket.length; i++) {
          if (allSocket[i].room === currentuserRoom && allSocket[i].Socket !== Socket) {
            allSocket[i].Socket.send(JSON.stringify({
              type: "chat",
              payload: parseMessage.payload
            }));
          }
        }
      }
    }
  });
});
