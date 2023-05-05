import { Injectable, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IRouterService implements OnDestroy {

  router = inject(Router);
  routerSub: Subscription;
  currentBaseUrl?: string;
  onSameUrlNavigation$ = new Subject<void>();

  constructor() {
    this.routerSub = this.router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(x => x as NavigationEnd),
    ).subscribe((e) => {
      let rawUrl = e.urlAfterRedirects;
      let baseUrl = this._getBaseUrl(rawUrl);
      if (this.currentBaseUrl && this.currentBaseUrl == baseUrl) {
        console.log(`Triggering onSameUrlNavigation event (baseUrl is ${baseUrl})...`);
        this.onSameUrlNavigation$.next();
        return;
      }      
      this.currentBaseUrl = baseUrl;
    });
  }

  _getBaseUrl(rawUrl: string): string {
    return rawUrl.replace(/^\/*/, "").split("/")[0];
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  
}
