import { Component, Input, inject } from '@angular/core';
import { Idea } from 'sonddr-shared';
import { NumberService } from 'src/app/services/number.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-idea-card',
  templateUrl: './idea-card.component.html',
  styleUrls: ['./idea-card.component.scss']
})
export class IdeaCardComponent {

  // dependencies
  // --------------------------------------------
  number = inject(NumberService);
  time = inject(TimeService);
  screen = inject(ScreenSizeService);

  // i/o
  // --------------------------------------------
  @Input("idea") idea?: Idea;

  
  // attributes
  // --------------------------------------------
  // ...


  // methods
  // --------------------------------------------
  // ...


}
