import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NavBarItemComponent } from './components/nav-bar-item/nav-bar-item.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { IdeasViewComponent } from './views/ideas-view/ideas-view.component';
import { SearchViewComponent } from './views/search-view/search-view.component';
import { MessagesViewComponent } from './views/messages-view/messages-view.component';
import { NotificationsViewComponent } from './views/notifications-view/notifications-view.component';
import { RouterModule } from '@angular/router'
import { GoalViewComponent } from './views/goal-view/goal-view.component';
import { DiscussionViewComponent } from './views/discussion-view/discussion-view.component';
import { IdeasTabComponent } from './components/ideas-tab/ideas-tab.component';
import { MessagesTabComponent } from './components/messages-tab/messages-tab.component';
import { FabComponent } from './components/fab/fab.component';
import { MatButtonModule } from '@angular/material/button';
import { AddViewComponent } from './views/add-view/add-view.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { IntersectionDirective } from './directives/intersection.directive';
import { HScrollComponent } from './components/h-scroll/h-scroll.component';
import { ChipComponent } from './components/chip/chip.component';
import { GoalChipComponent } from './components/goal-chip/goal-chip.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavBarItemComponent,
    MainNavComponent,
    IdeasViewComponent,
    SearchViewComponent,
    MessagesViewComponent,
    NotificationsViewComponent,
    IdeasTabComponent,
    MessagesTabComponent,
    FabComponent,
    AddViewComponent,
    TopBarComponent,
    IntersectionDirective,
    HScrollComponent,
    ChipComponent,
    GoalChipComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    RouterModule.forRoot([
      {path: "", redirectTo: "ideas", pathMatch: "full"},
      {path: "ideas", component: IdeasTabComponent, children: [
        {path: "", component: IdeasViewComponent},
        {path: "goal/:id", component: GoalViewComponent},
        {path: "add", component: AddViewComponent},
      ]},
      {path: "search", component: SearchViewComponent},
      {path: "messages", component: MessagesTabComponent, children: [
        {path: "", component: MessagesViewComponent},
        {path: "discussion/:id", component: DiscussionViewComponent},
      ]},
      {path: "notifications", component: NotificationsViewComponent},
    ]),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloak: KeycloakService) => {
        return () =>
        keycloak.init({
          config: {
            url: "http://localhost:8080",
            realm: "sonddr",
            clientId: "sonddr-frontend",
          },
          initOptions: {onLoad: "login-required"},
          loadUserProfileAtStartUp: true,
        })
      },
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
