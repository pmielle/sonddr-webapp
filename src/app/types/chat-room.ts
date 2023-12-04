import { Observable } from "rxjs";
import { Change, Message } from "sonddr-shared";

export class ChatRoom {

  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  listen(): Observable<Message[]|Change<Message>> {
    return new Observable<Message[]|Change<Message>>(subscriber => {
      this.ws.onmessage = (message: MessageEvent<string>) => {
        const payload = JSON.parse(message.data, (key, value) => {
          if (/[Dd]ate$/.test(key)) {
            value = new Date(value);
          }
          return value;
        });
        subscriber.next(payload);
      };
      this.ws.onerror = (e) => subscriber.error(e);
      return () => this.ws.close();
    });
  }

  send(message: string) {
    // TODO: use PLACEHOLDER_ID and add new message to a the message list
    // it will be replaced after insertion
    this.ws.send(message);
  }

}
