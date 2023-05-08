import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { fadeSlideInOut } from 'src/app/animations/in-out';
import { ScreenSize } from 'src/app/interfaces/screen-size';
import { Tab } from 'src/app/interfaces/tab';
import { DeviceService } from 'src/app/services/device.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-tab-icons',
  templateUrl: './tab-icons.component.html',
  styleUrls: ['./tab-icons.component.scss'],
  animations: [fadeSlideInOut],
})
export class TabIconsComponent {

  // dependencies
  // --------------------------------------------
  tab = inject(TabService);
  router = inject(Router);
  device = inject(DeviceService);

  // attributes
  // --------------------------------------------
  // ...

  // lifecycle hooks
  // --------------------------------------------
  // ...

  // methods
  // --------------------------------------------
  onTabIconClick(tab: Tab) {
    // switch tab if needed
    if (this.tab.selectedTab !== tab) {
      this.tab.goToTab(tab);
      return;
    }
    // otherwise, on mobile    
    if (this.device.screenSize$.getValue() == ScreenSize.Small) {
      // handle default tab (ideas) tap
      if (tab === this.tab.defaultTab) {
        // go back to home if not already
        if (this.router.url !== "/") {
          this.router.navigate(["/"]);
          return;
        }
        // otherwise, scroll back to top
        tab.html?.scrollTo({top: 0, behavior: "smooth"});
      }
    }
  }
}
