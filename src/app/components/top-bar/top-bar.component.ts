import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { ColorService } from 'src/app/services/color.service';
import { MainNavService } from 'src/app/services/main-nav.service';

type LeftItem = "back" | "close" | "logo";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  // dependencies
  // --------------------------------------------
  screen = inject(ScreenSizeService);
  location = inject(Location);
  color = inject(ColorService);
  mainNav = inject(MainNavService);
  
  // i/o
  // --------------------------------------------
  @Input("left-item") leftItem?: LeftItem;
  @Input("background-color") backgroundColor: string = "#303030";  // has to be hardcoded hex because colorservice
  @Input("reverse-scroll") reverseScroll = false;

  // attributes
  // --------------------------------------------
  stuck = false;
  
  // methods
  // --------------------------------------------
  onClick() {
    if (this.reverseScroll) {
      this.mainNav.scrollToBottom(true);
    } else {
      this.mainNav.scrollToTop(true);
    }
  }

}
