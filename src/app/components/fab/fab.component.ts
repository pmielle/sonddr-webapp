import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

type FabMode = {
  icon: string,
  color: string,
  label?: string,
  action: () => void,
};

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {

  // dependencies
  // --------------------------------------------
  router = inject(Router);
  screen = inject(ScreenSizeService);
  mainNav = inject(MainNavService);


  // attributes
  // --------------------------------------------
  mode?: FabMode;


  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(
      (e) => this.onRouteChange(e as NavigationEnd)
    );
  }

  // methods
  // --------------------------------------------
  onRouteChange(e: NavigationEnd) {
    const url = e.urlAfterRedirects;
    if (url === "/ideas") {
      this.mode = {
        icon: "add",
        color: "var(--primary-color)",
        label: "Share<br>an idea",
        action: () => {this.router.navigateByUrl("/ideas/add")}
      };
    } else if (url.startsWith("/ideas/goal/")) {
      const goalId = url.split(/\//)[3];
      this.mode = {
        icon: "add",
        color: "var(--primary-color)",
        label: "Share<br>an idea",
        action: () => {this.router.navigateByUrl(`/ideas/add?preselected=${goalId}`)}
      };
    } else if (url.startsWith("/ideas/user/")) {
      const userId = url.split(/\//)[3];
      this.mode = {
        icon: "add",
        color: "var(--blue)",
        label: "Send a<br>message",
        action: () => {this.router.navigateByUrl(`/messages`)}  // TODO: start a discussion
      };
    } else if (url.startsWith("/ideas/idea/")) {
      this.mode = {
        icon: "favorite_outline",
        color: "var(--primary-color)",
        label: "Support",
        action: () => {this.mainNav.fabClick.next();}
      };
    } else if (url === "/messages") {
      this.mode = {
        icon: "add",
        color: "var(--blue)",
        label: "Start a<br>discussion",
        action: () => {console.log("click in messages")}
      };
    } else if (url.startsWith("/ideas/add")) {
      this.mode = {
        icon: "done",
        color: "var(--green)",
        label: "Share",
        action: () => {console.log("click in add")}
      };
    } else if (url === "/ideas/profile") {
      this.mode = {
        icon: "logout",
        color: "var(--red)",
        label: "Log out",
        action: () => {console.log("click in profile")}
      };
    } else if (url.startsWith("/messages/discussion/")) {
      this.mode = undefined;
    } else if (url === "/notifications") {
      this.mode = undefined;
    } else if (url === "/search") {
      this.mode = undefined;
    } else if (url === "/") {
      this.mode = undefined;
    } else {
      throw new Error("unimplemented");
    }
  }

}
