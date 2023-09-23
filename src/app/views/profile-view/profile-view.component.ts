import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);
  time = inject(TimeService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);

}
