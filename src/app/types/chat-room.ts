import { Observable } from "rxjs";
import { Change, Message, User, placeholder_id } from "sonddr-shared";

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

  send(message: string, user: User) {
    this.ws.send(message);
    return this._makePlaceholderMessage(message, user);
  }


  // private
  // --------------------------------------------
  _makePlaceholderMessage(content: string, user: User): Message {
    return {
      id: placeholder_id,
      discussionId: placeholder_id,
      content: content,
      author: user,
      date: new Date(),
    }
  }

}