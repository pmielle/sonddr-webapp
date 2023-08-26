import { Component, Input, inject } from '@angular/core';
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
  

  // i/o
  // --------------------------------------------
  @Input("title") title?: string;
  @Input("left-item") leftItem?: LeftItem;

}
