import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { fadeSlideInOut } from 'src/app/animations/in-out';
import { Tab } from 'src/app/interfaces/tab';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-tab-icons',
  templateUrl: './tab-icons.component.html',
  styleUrls: ['./tab-icons.component.scss'],
  animations: [
    fadeSlideInOut,
  ],
})
export class TabIconsComponent {

  // dependencies
  // --------------------------------------------
  tab = inject(TabService);

  // attributes
  // --------------------------------------------
  // ...

  // lifecycle hooks
  // --------------------------------------------
  // ...

  // methods
  // --------------------------------------------
  onTabIconClick(tab: Tab) {
    this.tab.selectedTab = tab;
  }
}
