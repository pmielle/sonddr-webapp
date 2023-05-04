import { Injectable, OnDestroy, inject } from '@angular/core';
import { Auth, User, user, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, from, switchMap } from 'rxjs';
import { IUser } from '../interfaces/i-user';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  router = inject(Router);
  auth = inject(Auth);
  db = inject(DatabaseService);

  // attributes
  // --------------------------------------------
  user$: Observable<IUser|undefined> = user(this.auth).pipe(
    switchMap((user) => from(this._firebaseUserToIUser(user)))
  );

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnDestroy() { }

  // methods
  // --------------------------------------------
  async getUser(): Promise<IUser|undefined> {
    return firstValueFrom(this.user$);
  }

  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async _firebaseUserToIUser(user: User|null): Promise<IUser|undefined> {
    if (user) {
      let existingUser = await this.db.getUser(user.uid);
      if (existingUser) {        
        return existingUser;
      } else {
        return this.db.createUser(user.uid, user.displayName || user.uid);
      }
    } else {
      return undefined;
    }
  }
}
