import { Component, Input } from '@angular/core';
import { IComment } from 'src/app/interfaces/i-comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  // dependencies
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  @Input('comment') comment!: IComment;

  // lifecycle hooks
  // --------------------------------------------
  // ...

  // methods
  // --------------------------------------------
  // ...

}
