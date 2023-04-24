import { Component, inject } from '@angular/core';
import { Tab } from 'src/app/interfaces/tab';
import { IdeasViewComponent } from '../ideas-view/ideas-view.component';
import { SearchViewComponent } from '../search-view/search-view.component';
import { MessagesViewComponent } from '../messages-view/messages-view.component';
import { NotificationsViewComponent } from '../notifications-view/notifications-view.component';

@Component({
  selector: 'app-ideas-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent {
  
  // dependencies
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  tabs: Tab[] = [
    {name: "Ideas", icon: "lightbulb", component: IdeasViewComponent},
    {name: "Search", icon: "search", component: SearchViewComponent},
    {name: "Messages", icon: "forum", component: MessagesViewComponent},
    {name: "Notifications", icon: "notifications", component: NotificationsViewComponent},
  ];
  selectedTab: Tab = this.tabs[0];

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
}
