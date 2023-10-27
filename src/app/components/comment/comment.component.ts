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
  onUpvoteClick() {
    this.upvote.next();
    this.updateRating(1);
  }

  onDownvoteClick() {
    this.downvote.next();
    this.updateRating(-1);
  }

  updateRating(newUserVote: 1|-1) {
    if (! this.comment) { throw new Error("Cannot vote for an undefined comment"); }
    const ratingDiff = this.comment.userVote 
      ? this.comment.userVote - newUserVote 
      : -1 * newUserVote;
    this.comment.rating -= ratingDiff;
    this.comment.userVote = newUserVote;
  }

  chooseNewRating(previousRating: number, previousUserVote: number, newUserVote: number): number {
    return previousRating + (previousUserVote - newUserVote);
  }

  chooseRatingColor(): string {
    if (!this.comment) { return ""; }
    if (this.comment.rating === 0) { return "" };
    return this.comment.rating > 0
      ? "var(--green)"
      : "var(--red)";
  }

}
