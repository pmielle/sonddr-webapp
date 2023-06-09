import { BehaviorSubject, Observable } from "rxjs";
import { IdeasViewComponent } from "../views/ideas-view/ideas-view.component";
import { MessagesViewComponent } from "../views/messages-view/messages-view.component";
import { NotificationsViewComponent } from "../views/notifications-view/notifications-view.component";
import { SearchViewComponent } from "../views/search-view/search-view.component";
import { FabMode, homeMode } from "./fab-mode";

export interface Tab {
    name: string,
    icon: string,
    badge?: string,
    component: any,
    fab?: FabMode,
    html?: HTMLElement,
}

export let ideaTab: Tab = {
    name: "ideas", 
    icon: "lightbulb", 
    component: IdeasViewComponent, 
    fab: homeMode,
  }
  
  export let searchTab: Tab = {
    name: "search", 
    icon: "search", 
    component: SearchViewComponent,
  };
  
  export let messagesTab: Tab = {
    name: "messages", 
    icon: "sms", 
    component: MessagesViewComponent,
  };
  
  export let notificationsTab: Tab = {
    name: "notifications", 
    icon: "notifications", 
    component: NotificationsViewComponent,
  };