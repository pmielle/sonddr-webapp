import { Component, inject } from '@angular/core';
import { Notification } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.scss']
})
export class NotificationsViewComponent {

  // dependencies
  // --------------------------------------------
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  userData = inject(UserDataService);

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
  }

}
