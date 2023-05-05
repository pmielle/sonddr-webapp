import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentOrderBy, IComment, defaultCommentOrderBy } from 'src/app/interfaces/i-comment';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {

  // attributes
  // --------------------------------------------
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

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnInit(): void { }

  // methods
  // --------------------------------------------
  // ...

}
