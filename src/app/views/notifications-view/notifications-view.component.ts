import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.scss']
})
export class NotificationsViewComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  userData = inject(UserDataService);

  // attributes
  // --------------------------------------------
  showOlder = false;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
