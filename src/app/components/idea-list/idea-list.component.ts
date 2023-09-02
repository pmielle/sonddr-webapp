import { Component, Input } from '@angular/core';
import { Idea } from 'sonddr-shared';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss']
})
export class IdeaListComponent {
  @Input("ideas") ideas?: Idea[];
}
