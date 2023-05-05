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
  @Input('comments') comments!: IComment[];
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

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnInit(): void { }

  // methods
  // --------------------------------------------
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
    this.comments.unshift(newComment);
    this.content = "";
  }

}
