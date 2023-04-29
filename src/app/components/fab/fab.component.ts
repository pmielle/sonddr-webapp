import { Component, inject } from '@angular/core';
import { FabMode } from 'src/app/interfaces/fab-mode';
import { FabService } from 'src/app/services/fab.service';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
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
