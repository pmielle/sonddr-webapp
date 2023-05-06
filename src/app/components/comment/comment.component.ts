import { Component, Input, inject } from '@angular/core';
import { IComment } from 'src/app/interfaces/i-comment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  auth = inject(AuthenticationService);

  // attributes
  // --------------------------------------------
  @Input('comment') comment!: IComment;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._checkHasUpvoted();
    this._checkHasDownvoted();
  }

  // methods
  // --------------------------------------------
  async _checkHasUpvoted() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot upvote");
      return;
    }
    this.hasUpvoted = await this.db.hasUpvotedComment(this.comment.id, user.id);
  }

  async _checkHasDownvoted() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot upvote");
      return;
    }
    this.hasDownvoted = await this.db.hasDownvotedComment(this.comment.id, user.id);
  }
  
  async onUpvoteClick() {
    if (this.hasUpvoted === undefined) {
      console.error("hasUpvoted is undefined, cannot continue");
      return;
    }
    if (this.hasUpvoted) {
      this._removeUpvote();
    } else {
      this._upvote();
    }
  }

  onDownvoteClick() {
    if (this.hasDownvoted === undefined) {
      console.error("hasDownvoted is undefined, cannot continue");
      return;
    }
    if (this.hasDownvoted) {
      this._removeDownvote();
    } else {
      this._downvote();
    }
  }

  async _upvote() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot upvote");
      return;
    }
    if (this.hasDownvoted) {
      this._removeDownvote();
    }
    this.db.upvoteComment(this.comment.id, user.id);
    this.hasUpvoted = true;
    this.comment.upvotes += 1;
  }

  async _removeUpvote() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot remove upvote");
      return;
    }
    this.db.deleteCommentUpvote(this.comment.id, user.id);
    this.hasUpvoted = false;
    this.comment.upvotes -= 1;
  }

  async _downvote() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot downvote");
      return;
    }
    if (this.hasUpvoted) {
      this._removeUpvote();
    }
    this.db.downvoteComment(this.comment.id, user.id);
    this.hasDownvoted = true;
    this.comment.upvotes -= 1;
  }

  async _removeDownvote() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot remove downvote");
      return;
    }
    this.db.deleteCommentDownvote(this.comment.id, user.id);
    this.hasDownvoted = false;
    this.comment.upvotes += 1;
  }

}
