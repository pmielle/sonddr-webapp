import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { TabViewComponent } from './views/tab-view/tab-view.component';
import { GoalViewComponent } from './views/goal-view/goal-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { IdeaViewComponent } from './views/idea-view/idea-view.component';

const routes: Routes = [
  {path: "", component: TabViewComponent, children: [
    {path: "", component: HomeViewComponent},
    {path: "goal", component: GoalViewComponent},
    {path: "idea", component: IdeaViewComponent},
  ]},
  {path: "login", component: LoginViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
