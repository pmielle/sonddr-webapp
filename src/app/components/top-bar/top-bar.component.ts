import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

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
  
  // i/o
  // --------------------------------------------
  @Input("left-item") leftItem?: LeftItem;

  // attributes
  // --------------------------------------------
  stuck = false;
  
  // methods
  // --------------------------------------------
  // ...

}
