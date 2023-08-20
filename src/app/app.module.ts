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
import { TabsComponent } from './components/tabs/tabs.component';
import { IdeasViewComponent } from './views/ideas-view/ideas-view.component';
import { SearchViewComponent } from './views/search-view/search-view.component';
import { MessagesViewComponent } from './views/messages-view/messages-view.component';
import { NotificationsViewComponent } from './views/notifications-view/notifications-view.component';
import { RouterModule, Routes } from '@angular/router'

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavBarItemComponent,
    TabsComponent,
    IdeasViewComponent,
    SearchViewComponent,
    MessagesViewComponent,
    NotificationsViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    RouterModule.forRoot([
      {path: "", component: IdeasViewComponent},
      {path: "", component: SearchViewComponent, outlet: "search"},
      {path: "", component: MessagesViewComponent, outlet: "messages"},
      {path: "", component: NotificationsViewComponent, outlet: "notifications"},
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
