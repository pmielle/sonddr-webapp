export class ChatRoom {

  ws: WebSocket;
  // TODO: create an obs of message[]|change<message> or something like this

  constructor(ws: WebSocket) {
    this.ws = ws;
    ws.onmessage = (message) => this.onMessage(message);
    ws.onerror = (e) => console.error(e);
  }

  onMessage(message: MessageEvent<string>) {
    const payload = JSON.parse(message.data, (key, value) => {
      if (/[Dd]ate$/.test(key)) {
        value = new Date(value);
      }
      return value;
    });
    // TODO: do something with new messages
    console.log(payload);
  }

  leave() {
    this.ws.close();
  }

  send(message: string) {
    // TODO: use PLACEHOLDER_ID and add new message to a the message list
    // it will be replaced after insertion
    this.ws.send(message);
  }

}
