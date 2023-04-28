import { Component } from '@angular/core';
import { FabMode } from 'src/app/interfaces/fab-mode';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {

  // dependencies
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  mode: FabMode|undefined = {
    color: "red",
    label: "Share<br> an idea",
    icon: "add"
  };

  // lifecycle hooks
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  // ...
}
