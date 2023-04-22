import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { IdeasViewComponent } from './views/ideas-view/ideas-view.component';

const routes: Routes = [
  {path: "ideas", component: IdeasViewComponent},
  {path: "login", component: LoginViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
