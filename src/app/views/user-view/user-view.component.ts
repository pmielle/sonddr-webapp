import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { ideaTab } from 'src/app/interfaces/tab';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  fab = inject(FabService);
  route = inject(ActivatedRoute);

  // attributes
  // --------------------------------------------
  user?: IUser;
  fabClickSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadUser();
    this.fabClickSub = this._subscribeToFabClick();
  }

  ngOnDestroy(): void {
    this.fabClickSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _onFabClick() {
    console.log("click....");
  }
  
  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
  }

  _loadUser(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let userId = this.route.snapshot.paramMap.get("id");
      if (!userId) {
        reject("Failed to get \"id\" from paramMap: cannot get the id of the user to display");
        return;
      }
      this.user = await this.db.getUser(userId);
      if (!this.user) {
        console.error(`Failed to get user ${userId}`);
        return;
      }
    });
  }
}
