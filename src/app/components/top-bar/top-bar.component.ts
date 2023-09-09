import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { ColorService } from 'src/app/services/color.service';

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
  
  // i/o
  // --------------------------------------------
  @Input("left-item") leftItem?: LeftItem;
  @Input("background-color") backgroundColor: string = "#303030";

  // attributes
  // --------------------------------------------
  stuck = false;
  
  // methods
  // --------------------------------------------
  // ...

}
