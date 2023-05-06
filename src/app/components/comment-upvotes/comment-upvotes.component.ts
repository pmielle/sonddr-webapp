import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IComment } from 'src/app/interfaces/i-comment';

@Component({
  selector: 'app-comment-upvotes',
  templateUrl: './comment-upvotes.component.html',
  styleUrls: ['./comment-upvotes.component.scss']
})
export class CommentUpvotesComponent {

  // attributes
  // --------------------------------------------
  @Input('comment') comment!: IComment;
  @Input('is-upvoted') isUpvoted!: boolean;
  @Input('is-downvoted') isDownvoted!: boolean;
  @Output('upvote-click') upvoteClick = new EventEmitter<void>();
  @Output('downvote-click') downvoteClick = new EventEmitter<void>();

  // methods
  // --------------------------------------------
  chooseTextColor(): string {
    if (this.comment.upvotes > 0) { return "green"; }
    if (this.comment.upvotes < 0) { return "red"; }
    return "gray";
  }

  chooseUpArrowColor() {
    if (this.isUpvoted) { return "green"; }
    return "gray";
  }

  chooseDownArrowColor() {
    if (this.isDownvoted) { return "red"; }
    return "gray";
  }

}
