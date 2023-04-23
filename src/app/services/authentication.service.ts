import { Injectable, OnDestroy, inject } from '@angular/core';
import { Auth, User, user, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  router = inject(Router);
  auth = inject(Auth);

  // attributes
  // --------------------------------------------
  user$: Observable<IUser|undefined> = user(this.auth).pipe(
    tap((user) => this._onFirebaseUserChange(user)),
    map((user) => this._firebaseUserToIUser(user))
  );

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnDestroy() { }

  // methods
  // --------------------------------------------
  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  _firebaseUserToIUser(user: User|null): IUser|undefined {
    if (user) {
      return {
        id: user.uid,
        name: user.displayName || user.uid,
      } as IUser;
    } else {
      return undefined;
    }
  }

  _onFirebaseUserChange(user: User|null) {
    if (user) {
      this.router.navigate(["ideas"]);
    } else {
      this.router.navigate(["login"]);
    }
  }
}
