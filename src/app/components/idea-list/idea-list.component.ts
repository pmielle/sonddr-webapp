import { Component, Input, inject } from '@angular/core';
import { Idea } from 'sonddr-shared';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss']
})
export class IdeaListComponent {

  // dependencies
  // --------------------------------------------
  screen = inject(ScreenSizeService);

  // i/o
  // --------------------------------------------
  @Input("ideas") ideas?: Idea[];
}
