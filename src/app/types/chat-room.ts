import { BehaviorSubject, Observable } from "rxjs";
import { Change, Message, User, placeholder_id, delete_str, } from "sonddr-shared";

export class ChatRoom {

  ws: WebSocket;
  user$: BehaviorSubject<User|undefined>;

  constructor(ws: WebSocket, user$: BehaviorSubject<User|undefined>) {
    this.ws = ws;
    this.user$ = user$;
  }

  listen(): Observable<Message[]|Change<Message>> {
    return new Observable<Message[]|Change<Message>>(subscriber => {
      this.ws.onmessage = (message: MessageEvent<string>) => {
        const data = JSON.parse(message.data, (key, value) => {
          if (/[Dd]ate$/.test(key)) {
            value = new Date(value);
          }
          return value;
        });
        subscriber.next(data);
      };
      this.ws.onerror = (e) => subscriber.error(e);
      return () => this.ws.close();
    });
  }

  send(message: string, user: User) {
    this.ws.send(message);
    return this._makePlaceholderMessage(message, user);
  }

  delete(messageId: string) {
    this.ws.send(`${delete_str}${messageId}`);
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
      deleted: false,
    }
  }

}
