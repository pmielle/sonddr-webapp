import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommentOrderBy, IComment, defaultCommentOrderBy } from 'src/app/interfaces/i-comment';
import { Idea } from 'src/app/interfaces/idea';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthenticationService);
  db = inject(DatabaseService);

  // attributes
  // --------------------------------------------
  @Input('idea') idea!: Idea;

  _comments: IComment[] = [];
  get comments() { return this._comments; }
  @Input('comments') set comments(value) {
    this._comments = value;
    this._onCommentsChange();
  }

  @Output('order-by-change') orderByChange$ = new EventEmitter<CommentOrderBy>();
  _orderByField?: CommentOrderBy = defaultCommentOrderBy;
  get orderByField() { return this._orderByField; }
  set orderByField(value) {    
    if (value) {      
      this.orderByChange$.next(value);
    }
    this._orderByField = value;
  }
  CommentOrderBy = CommentOrderBy;
  content: string = "";
  collapsed = true;

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnInit(): void { }

  // methods
  // --------------------------------------------
  seeMore() {
    this.collapsed = false;
  }

  makeSeeMoreLabel(): string|undefined {
    let nAdditionalComments = this.comments.length - 1;
    if (nAdditionalComments <= 0) {
      return undefined;
    }
    return `See ${nAdditionalComments} more comment${nAdditionalComments > 1 ? 's' : ''}`;
  }

  async postComment() {
    // validate inputs
    if (!this.content) {
      console.error("Missing content");
      return;
    }
    // get the current user and set it as author
    let user = await this.auth.getUser();
    if (!user) {
      console.error("Logged in user is not defined");
      return;
    }
    // post
    let newComment = await this.db.postComment(this.content, this.idea.id, user.id);
    // epilogue
    this._afterCommentPost(newComment);
  }

  _afterCommentPost(newComment: IComment) {
    this.content = "";
    this.comments.unshift(newComment);  // does not trigger the setter
  }

  _onCommentsChange() {
    this.collapsed = true;
  }

}
