import { Component, Input } from '@angular/core';
import { Comment } from 'sonddr-shared';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent {

  @Input('comments') comments?: Comment[];

}
