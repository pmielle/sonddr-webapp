import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Comment } from 'sonddr-shared';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  // dependencies
  // --------------------------------------------
  time = inject(TimeService);

  // I/O
  // --------------------------------------------
  @Input('comment') comment?: Comment;
  @Output('upvote') upvote = new EventEmitter<void>();
  @Output('downvote') downvote = new EventEmitter<void>();

  // methods
  // --------------------------------------------
  chooseRatingColor(): string {
    if (!this.comment) { return ""; }
    if (this.comment.rating === 0) { return "" };
    return this.comment.rating > 0
      ? "var(--green)"
      : "var(--red)";
  }

}
