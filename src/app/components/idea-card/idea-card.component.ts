import { Component, Input } from '@angular/core';
import { Idea } from 'sonddr-shared';

@Component({
  selector: 'app-idea-card',
  templateUrl: './idea-card.component.html',
  styleUrls: ['./idea-card.component.scss']
})
export class IdeaCardComponent {

  @Input("idea") idea?: Idea;

}
