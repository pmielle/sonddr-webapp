import { Component, Input } from '@angular/core';
import { Idea } from 'src/app/interfaces/idea';

@Component({
  selector: 'app-idea-card',
  templateUrl: './idea-card.component.html',
  styleUrls: ['./idea-card.component.scss']
})
export class IdeaCardComponent {

  // attributes
  // --------------------------------------------
  @Input('idea') idea!: Idea;

  // lifecycle hooks
  // --------------------------------------------
  // ...
}
