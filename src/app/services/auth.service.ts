import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { User } from 'sonddr-shared';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // dependencies
  // --------------------------------------------
  keycloak = inject(KeycloakService);
  http = inject(HttpService);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  user$ = new BehaviorSubject<User | undefined>(undefined);

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.loadUser();
  }


  // public methods
  // --------------------------------------------
  goToProfile() {
    const user = this.user$.getValue();
    if (! user) { throw new Error("User is undefined"); }
    this.router.navigateByUrl(`/ideas/user/${user.id}`);
  }

  async getToken(): Promise<string> {
    return this.keycloak.getToken();
  }

  async loadUser() {
    const userProfile = await this.keycloak.loadUserProfile();
    const id = userProfile.id;
    if (id === undefined) { throw new Error("id missing from keycloak profile"); }
    const name = this._choose_name(userProfile);
    let user: User;
    try {
      user = await this.http.getUser(id);
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 404) {
        await this.http.createUser(id, name);
        user = await this.http.getUser(id);
      } else {
        throw err;
      }
    }
    this.user$.next(user);
  }

  // private
  // --------------------------------------------
  _choose_name(profile: KeycloakProfile): string {
    const firstName = profile.firstName;
    const lastName = profile.lastName;
    const name = (firstName && lastName) ? `${firstName} ${lastName}` : profile.username;
    if (!name) {
      throw new Error(`Failed to choose username for ${profile.id}`);
    }
    return name;

  }
}
