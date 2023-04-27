import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthenticationService);
  router = inject(Router);

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._redirectIfLoggedIn();
  }
  ngOnInit() { }

  // methods
  // --------------------------------------------
  _redirectIfLoggedIn() {
    firstValueFrom(this.auth.user$).then((user) => {
      if (user) {
        this.router.navigate(["/"])
      }
    })
  }
}
