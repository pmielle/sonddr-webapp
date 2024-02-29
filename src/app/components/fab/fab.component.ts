import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';



@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(10px)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateX(10px)' })),
      ]),
    ]),
  ],
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
