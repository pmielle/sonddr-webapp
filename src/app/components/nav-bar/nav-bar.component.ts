import { Component, inject } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { MainNavService, Tab } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  mainNav = inject(MainNavService);
  screen = inject(ScreenSizeService);
  userData = inject(UserDataService);

  discussionsBadge$ = this.userData.discussions$.pipe(map((discussions) => {
    if (! discussions || discussions.length === 0) { return undefined; }
    const nbNotif = discussions.length;  // TODO: filter on a "read" boolean or something
    return nbNotif > 99 ? "99+" : nbNotif;
  }));

  notificationsBadge$ = this.userData.notifications$.pipe(map((notifications) => {
    if (! notifications || notifications.length === 0) { return undefined; }
    const nbNotif = notifications.length;  // TODO: filter on a "read" boolean or something
    return nbNotif > 99 ? "99+" : nbNotif;
  }));

  onClick(tab: Tab) {
    if (this.mainNav.tab$.getValue() === tab) {
      if (this.mainNav.atTabRoot$.getValue()) {
        this.mainNav.scrollToTop(true);
      } else {
        this.mainNav.goToTab(tab);
      }
    } else {
      this.mainNav.goToTab(tab);
    }
  }

}
