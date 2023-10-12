import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.component.html',
  styleUrls: ['./new-discussion.component.scss']
})
export class NewDiscussionComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthService);
  screen = inject(ScreenSizeService);
  route = inject(ActivatedRoute);
  api = inject(ApiService);

  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  selectedUser?: User;
  searchString = "";
  searchResults?: User[];

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(async map => {
      const id = map.get("preselected");
      if (id) {
        const user = await this.api.getUser(id);
        this.selectedUser = user;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe;
  }

  // methods
  // --------------------------------------------
  selectUser(user: User) {
    this.selectedUser = user;
    this.searchResults = undefined;
    this.searchString = "";
  }

  clearUser() {
    this.selectedUser = undefined;
    this.searchResults = undefined;
    this.searchString = "";
  }

  onInputKeyup(e: KeyboardEvent) {
    if (e.code === "Enter") {
      this.search();
    // search if at least 3 characters 
    // or if a search has been forced already using 'Enter'
    } else if (this.searchString.length > 2 || this.searchResults?.length) {
      this.search();
    } else {
      this.clearSearch();
    }
  }

  async search() {
    if (!this.searchString) { 
      this.clearSearch(); 
      return;
    }
    this.searchResults = await this.api.searchUsers(this.searchString);
  }

  clearSearch() {
    this.searchResults = undefined;
  }
  
}
