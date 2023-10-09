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
  isNavBarFlat = false;
  isFabHidden = false;
  isFabDisabled = false;
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

  flattenNavBar() {
    this.isNavBarFlat = true;
  }
  restoreNavBar() {
    this.isNavBarFlat = false;
  }

  hideFab() {
    this.isFabHidden = true;
  }
  showFab() {
    this.isFabHidden = false;
  }

  enableFab() {
    this.isFabDisabled = false;
  }
  disableFab() {
    this.isFabDisabled = true;
  }

  restoreFab() {
    this.isFabHidden = false;
    this.isFabDisabled = false;
  }
  
}
