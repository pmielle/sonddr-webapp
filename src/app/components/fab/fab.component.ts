import { Component, inject } from '@angular/core';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {

  screen = inject(ScreenSizeService);

}
