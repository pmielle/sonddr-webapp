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
  private baseUrl = `${location.origin.replace(/^http/, 'ws')}/api/ws`;


  // lifecycle hooks
  // --------------------------------------------
  constructor() { }


  // public methods
  // --------------------------------------------
  async getChatRoom(discussionId: string): Promise<ChatRoom> {
    const token = await this.auth.getToken();
    const ws = new WebSocket(`${this.baseUrl}/messages?discussionId=${discussionId}&token=${token}`);
    return new ChatRoom(ws);
  }

}
