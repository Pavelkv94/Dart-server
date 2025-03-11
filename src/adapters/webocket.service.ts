import { WebSocketServer } from "ws";
import { injectable } from "inversify";
import { randomUUID } from "crypto";
import { MessagesRepository } from "../features/messages/repositories/messages.repository";

@injectable()
export class WebSocketService {
  private wss: WebSocketServer;

  constructor(port: number, private messagesRepository: MessagesRepository) {
    this.wss = new WebSocketServer(
      {
        port,
      },
      () => console.log(`WS Server started on ${port}`)
    );

    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.wss.on("connection", (ws) => {
      ws.on("message", (message: any) => {
        const parsedMessage = JSON.parse(message.toString());
        console.log(parsedMessage);
        const newMessage = {
          ...parsedMessage,
          id: randomUUID(),
          createdAt: new Date().toISOString(),
        };

        this.messagesRepository.saveMessage(newMessage);

        switch (parsedMessage.event) {
          case "message":
          case "connection":
            this.broadcastMessage(parsedMessage);
            break;
        }
      });
    });
  }

  private broadcastMessage(message: any) {
    this.wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  }
}
