import { Component, OnInit, inject } from '@angular/core';
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

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnInit() { }
}
