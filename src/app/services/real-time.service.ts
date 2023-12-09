import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ChatRoom } from '../types/chat-room';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {

  api = inject(ApiService);
  auth = inject(AuthService);

  constructor() { }

  async getChatRoom(discussionId: string): Promise<ChatRoom> {
    const token = await this.auth.keycloak.getToken();
    const ws = new WebSocket(`${this.api.apiWsUrl}/messages?discussionId=${discussionId}&token=${token}`);
    return new ChatRoom(ws);
  }

}
