import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Idea, IdeaOrderBy } from 'src/app/interfaces/idea';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss']
})
export class IdeaListComponent implements OnInit {

  // attributes
  // --------------------------------------------
  @Input('ideas') ideas!: Idea[];
  _oderByField?: IdeaOrderBy;
  get orderByField() { return this._oderByField; }
  @Input() set orderByField(value) {
    this._oderByField = value;
    this.orderByFieldChange.emit(this.orderByField);
  }
  @Output() orderByFieldChange = new EventEmitter<IdeaOrderBy>();
  @Input('header-color') headerColor: string = "var(--background-color)";
  IdeaOrderBy = IdeaOrderBy;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() { }

  // methods
  // --------------------------------------------
  // ...
}
