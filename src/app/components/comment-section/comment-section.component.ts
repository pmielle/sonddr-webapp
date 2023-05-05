import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentOrderBy, IComment } from 'src/app/interfaces/i-comment';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent {

  // attributes
  // --------------------------------------------
  @Input('comments') comments!: IComment[];
  _oderByField?: CommentOrderBy;
  get orderByField() { return this._oderByField; }
  @Input() set orderByField(value) {
    this._oderByField = value;
    this.orderByFieldChange.emit(this.orderByField);
  }
  @Output() orderByFieldChange = new EventEmitter<CommentOrderBy>();
  CommentOrderBy = CommentOrderBy;

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // methods
  // --------------------------------------------
  // ...

}
