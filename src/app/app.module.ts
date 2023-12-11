import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';
import { AddViewComponent } from './views/add-view/add-view.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { IntersectionDirective } from './directives/intersection.directive';
import { HScrollComponent } from './components/h-scroll/h-scroll.component';
import { ChipComponent } from './components/chip/chip.component';
import { GoalChipComponent } from './components/goal-chip/goal-chip.component';
import { IdeaListComponent } from './components/idea-list/idea-list.component';
import { IdeaCardComponent } from './components/idea-card/idea-card.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { IdeaViewComponent } from './views/idea-view/idea-view.component';
import { ExternalLinkComponent } from './components/external-link/external-link.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { UserViewComponent } from './views/user-view/user-view.component';
import { CommentSectionPreviewComponent } from './components/comment-section-preview/comment-section-preview.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { NotificationComponent } from './components/notification/notification.component';
import { MessageComponent } from './components/message/message.component';
import { NewDiscussionComponent } from './views/new-discussion/new-discussion.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RedDotComponent } from './components/red-dot/red-dot.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavBarItemComponent,
    MainNavComponent,
    IdeasViewComponent,
    SearchViewComponent,
    MessagesViewComponent,
    DiscussionViewComponent,
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
    IdeaListComponent,
    IdeaCardComponent,
    ProfilePictureComponent,
    GoalViewComponent,
    IdeaViewComponent,
    ExternalLinkComponent,
    ProfileViewComponent,
    UserViewComponent,
    CommentSectionPreviewComponent,
    CommentComponent,
    CommentSectionComponent,
    DiscussionComponent,
    NotificationComponent,
    MessageComponent,
    NewDiscussionComponent,
    RedDotComponent,
    FilePickerComponent,
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
    MatMenuModule,
    FormsModule,
    RouterModule.forRoot([
      {path: "", redirectTo: "ideas", pathMatch: "full"},
      {path: "ideas", component: IdeasTabComponent, children: [
        {path: "", component: IdeasViewComponent},
        {path: "idea/:id", component: IdeaViewComponent},
        {path: "goal/:id", component: GoalViewComponent},
        {path: "add", component: AddViewComponent},
        {path: "profile", component: ProfileViewComponent},
        {path: "user/:id", component: UserViewComponent},
      ]},
      {path: "search", component: SearchViewComponent},
      {path: "messages", component: MessagesTabComponent, children: [
        {path: "", component: MessagesViewComponent},
        {path: "new-discussion", component: NewDiscussionComponent},
        {path: "discussion/:id", component: DiscussionViewComponent},
      ]},
      {path: "notifications", component: NotificationsViewComponent},
    ], {
      scrollPositionRestoration: "enabled",
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloak: KeycloakService) => {
        return () =>
        keycloak.init({
          config: {
            url: "http://0.0.0.0:8080",
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
