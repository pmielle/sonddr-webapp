import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabViewComponent } from './views/tab-view/tab-view.component';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { TabIconsComponent } from './components/tab-icons/tab-icons.component';
import { IdeasViewComponent } from './views/ideas-view/ideas-view.component';
import { SearchViewComponent } from './views/search-view/search-view.component';
import { MessagesViewComponent } from './views/messages-view/messages-view.component';
import { NotificationsViewComponent } from './views/notifications-view/notifications-view.component';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { FabComponent } from './components/fab/fab.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { GoalViewComponent } from './views/goal-view/goal-view.component';
import { DiscussionViewComponent } from './views/discussion-view/discussion-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { GoalChipComponent } from './components/goal-chip/goal-chip.component';
import { HScrollComponent } from './components/h-scroll/h-scroll.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { IdeaListComponent } from './components/idea-list/idea-list.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    TabViewComponent,
    LoginViewComponent,
    TabIconsComponent,
    IdeasViewComponent,
    SearchViewComponent,
    MessagesViewComponent,
    NotificationsViewComponent,
    ProfilePictureComponent,
    FabComponent,
    GoalViewComponent,
    DiscussionViewComponent,
    HomeViewComponent,
    GoalChipComponent,
    HScrollComponent,
    TopBarComponent,
    IdeaListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
