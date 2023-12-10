import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Idea } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements AfterViewInit {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthService);
  http = inject(HttpService);

  // attributes
  // --------------------------------------------
  searchString: string = "";
  ideas?: Idea[];
  @ViewChild('input') input?: ElementRef;

  // lifecycle hooks
  // --------------------------------------------
  ngAfterViewInit(): void {
    this.input?.nativeElement.focus();
  }

  // methods
  // --------------------------------------------
  makeSearchResultsLabel(): string {
    if (!this.ideas) { return ""; }
    const nb = this.ideas.length;
    const plural = nb > 1;
    return `${nb} search result${plural ? 's': ''}`;
  }

  search() {
    this.input?.nativeElement.blur();
    if (!this.searchString) {
      this.clearSearch();
      return;
    }
    this.http.searchIdeas(this.searchString).then(i => this.ideas = i);
  }

  clearSearch() {
    this.searchString = "";
    this.ideas = undefined;
    this.input?.nativeElement.focus();
  }

}
