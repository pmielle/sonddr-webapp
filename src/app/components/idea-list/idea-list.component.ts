import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Idea, IdeaOrderBy, defaultIdeaOrderBy } from 'src/app/interfaces/idea';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss']
})
export class IdeaListComponent implements OnInit {

  // attributes
  // --------------------------------------------
  @Input('header-color') headerColor: string = "var(--background-color)";
  @Input('ideas') ideas!: Idea[];
  @Output('order-by-change') orderByChange$ = new EventEmitter<IdeaOrderBy>();
  _orderByField?: IdeaOrderBy = defaultIdeaOrderBy;
  get orderByField() { return this._orderByField; }
  set orderByField(value) {    
    if (value) {      
      this.orderByChange$.next(value);
    }
    this._orderByField = value;
  }  
  IdeaOrderBy = IdeaOrderBy;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() { }

  // methods
  // --------------------------------------------
  // ...
}
