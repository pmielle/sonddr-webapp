import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { User } from 'sonddr-shared';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keycloak = inject(KeycloakService);
  http = inject(HttpService);
  user$ = new BehaviorSubject<User|undefined>(undefined);

  constructor() {
    this.loadUser();
  }

  async loadUser() {
    const userProfile = await this.keycloak.loadUserProfile();
    const id = userProfile.id;
    const name = userProfile.username;
    if (id === undefined) { throw new Error("id missing from keycloak profile"); }
    if (name === undefined) { throw new Error("name missing from keycloak profile"); }
    let user: User;
    try {
      user = await this.http.getUser(id);
      this.user$.next(user);
    } catch(err) {
      if (err instanceof HttpErrorResponse && err.status === 404) {
        await this.http.createUser(id, name);
        user = await this.http.getUser(id);
      } else {
        throw err;
      }
    }
    this.user$.next(user);
  }
}
