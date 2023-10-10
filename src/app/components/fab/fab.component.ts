import { Component, inject } from '@angular/core';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';



@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {

  // dependencies
  // --------------------------------------------
  screen = inject(ScreenSizeService);
  mainNav = inject(MainNavService);

  // attributes
  // --------------------------------------------
  // ...

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
  }

  // methods
  // --------------------------------------------
  // ...

}
