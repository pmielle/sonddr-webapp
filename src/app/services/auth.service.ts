import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { User } from 'sonddr-shared';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keycloak = inject(KeycloakService);
  api = inject(ApiService);
  user$ = new BehaviorSubject<User|undefined>(undefined);

  constructor() {
    this.loadUser();
  }

  async loadUser() {
    const id = this.keycloak.getUsername();
    this.user$.next(await this.api.getUser(id));
  }
}
