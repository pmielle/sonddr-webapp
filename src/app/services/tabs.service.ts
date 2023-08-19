import { Injectable } from '@angular/core';

type Tab = "ideas" | "search" | "messages" | "notifications"

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  selected: Tab = "ideas";

  switchToTab(t: Tab) {
    if (t == this.selected) { return; }
    this.selected = t;
  }
}
