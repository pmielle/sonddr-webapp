import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { TabViewComponent } from './views/tab-view/tab-view.component';
import { GoalViewComponent } from './views/goal-view/goal-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';

const routes: Routes = [
  {path: "", component: TabViewComponent, children: [
    {path: "", component: HomeViewComponent},
    {path: "goal", component: GoalViewComponent},
  ]},
  {path: "login", component: LoginViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
