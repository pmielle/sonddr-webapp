import { Injectable, OnDestroy, inject } from '@angular/core';
import { Auth, User, user, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  auth = inject(Auth);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  user$ = user(this.auth);
  userSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() { 
    this.userSub = this.user$.subscribe((aUser: User|null) => {
      if (aUser) {
        this.router.navigate(["ideas"]);
      } else {
        this.router.navigate(["login"]);
      }
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }
}
