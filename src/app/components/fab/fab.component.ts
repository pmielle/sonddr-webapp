import { Component, inject } from '@angular/core';
import { fadeSlideInOut } from 'src/app/animations/in-out';
import { FabService } from 'src/app/services/fab.service';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  animations: [fadeSlideInOut],
})
export class FabComponent {

  // dependencies
  // --------------------------------------------
  fab = inject(FabService);

  // attributes
  // --------------------------------------------
  // ...

  // lifecycle hooks
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  // ...
}
