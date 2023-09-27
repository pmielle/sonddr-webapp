import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainNavService {

  // dependencies
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  isNavBarHidden = false;
  isFabHidden = false;
  fabClick = new EventEmitter<void>();

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    
  }

  // methods
  // --------------------------------------------
  hideNavBar() {
    this.isNavBarHidden = true;
  }

  showNavBar() {
    this.isNavBarHidden = false;
  }
  
}
