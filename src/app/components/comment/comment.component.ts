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
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;

  // lifecycle hooks
  // --------------------------------------------
  // ...

  // methods
  // --------------------------------------------
  onDownvoteClick() {
    if (this.hasDownvoted === undefined) {
      console.error("hasDownvoted is undefined, cannot continue");
      return;
    }
    // ...
  }

  onUpvoteClick() {
    if (this.hasDownvoted === undefined) {
      console.error("hasUpvoted is undefined, cannot continue");
      return;
    }
    // ...
  }

}
