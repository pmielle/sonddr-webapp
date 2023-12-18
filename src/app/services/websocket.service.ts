import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { ChatRoom } from '../types/chat-room';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // dependencies
  // --------------------------------------------
  http = inject(HttpService);
  auth = inject(AuthService);


  // attributes
  // --------------------------------------------
  url = "ws://192.168.1.14:3000";


  // lifecycle hooks
  // --------------------------------------------
  constructor() { }


  // public methods
  // --------------------------------------------
  async getChatRoom(discussionId: string): Promise<ChatRoom> {
    const token = await this.auth.getToken();
    const ws = new WebSocket(`${this.url}/messages?discussionId=${discussionId}&token=${token}`);
    return new ChatRoom(ws);
  }

}
