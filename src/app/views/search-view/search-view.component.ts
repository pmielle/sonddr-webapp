import { Component, inject } from '@angular/core';
import { Idea } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthService);
  api = inject(ApiService);

  // attributes
  // --------------------------------------------
  searchString: string = "";
  ideas?: Idea[];

  // methods
  // --------------------------------------------
  onSortByChange(sortBy: SortBy) {
    this.search(sortBy);
  }
  
  makeSearchResultsLabel(): string {
    if (!this.ideas) { return ""; }
    const nb = this.ideas.length;
    const plural = nb > 1;
    return `${nb} search result${plural ? 's': ''}`;
  }

  search(sortBy: SortBy) {
    if (!this.searchString) { 
      this.clearSearch();
      return;
    }
    this.api.getIdeas(sortBy).then(i => this.ideas = i);  // TODO: filter by search string
  }

  clearSearch() {
    this.searchString = "";
    this.ideas = undefined;
  }

}
