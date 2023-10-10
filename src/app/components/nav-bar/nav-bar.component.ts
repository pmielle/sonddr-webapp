import { Component, inject } from '@angular/core';
import { MainNavService, Tab } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  mainNav = inject(MainNavService);
  screen = inject(ScreenSizeService);

  onClick(tab: Tab) {
    if (this.mainNav.tab$.getValue() === tab) {
      this.mainNav.scrollToTop(true);
    } else {
      this.mainNav.goToTab(tab);
    }
  }
}
