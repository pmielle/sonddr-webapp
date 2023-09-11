import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Idea } from 'sonddr-shared';
import { ColorService } from 'src/app/services/color.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

export type SortBy = "recent" | "popular";

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss']
})
export class IdeaListComponent {

  // dependencies
  // --------------------------------------------
  screen = inject(ScreenSizeService);
  color = inject(ColorService);

  // i/o
  // --------------------------------------------
  @Input("ideas") ideas?: Idea[];
  @Input("stuck-background-color") stuckBackgroundColor: string = "#303030";
  @Output("sort-by-change") sortByChange = new EventEmitter<SortBy>();

  // attributes
  // --------------------------------------------
  stuck = [false, false, false];  // one for each section header
  sortBy: SortBy = "recent";

  // methods
  // --------------------------------------------
  updateSortBy(sortBy: SortBy) {
    this.sortBy = sortBy;
    this.sortByChange.next(sortBy);
  }

}
