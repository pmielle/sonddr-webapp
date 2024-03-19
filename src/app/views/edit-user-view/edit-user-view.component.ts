import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { User } from 'sonddr-shared';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { EditorComponent } from 'src/app/components/editor/editor.component';

@Component({
  selector: 'app-edit-user-view',
  templateUrl: './edit-user-view.component.html',
  styleUrl: './edit-user-view.component.scss'
})
export class EditUserViewComponent {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  http = inject(HttpService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  mainNav = inject(MainNavService);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  mainSub?: Subscription;
  fabSub?: Subscription;
  coverPreview?: string;
  name = "";
  cover?: File;
  initialName?: string;
  initialBio?: string;
  user?: User;
  @ViewChild(EditorComponent) editor!: EditorComponent;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {

    // get data
    this.mainSub = this.route.paramMap.pipe(
      switchMap(params => {
        const userId = params.get("id");
        if (userId) {
          return this.http.getUser(userId);
        } else {
          throw new Error("Missing id parameter");
        }
      })
    ).subscribe(u => {
      if (u.isUser) {
        this.user = u;
        this.setupEdit(u);
      } else {
        throw new Error("Unauthorized");
      }
    });

    // hide bottom bar and disable fab
    this.mainNav.hideNavBar();
    this.mainNav.disableFab();

    // listen to fab clicks
    this.fabSub = this.mainNav.fabClick.subscribe(() => {
        this.submit();
    });
  }

  ngOnDestroy(): void {

    // unsubscribe
    this.mainSub?.unsubscribe();
    this.fabSub?.unsubscribe();

    // restore nav bar and fab
    this.mainNav.showNavBar();
    this.mainNav.restoreFab();
  }

  // methods
  // --------------------------------------------
  setupEdit(user: User) {
    this.name = user.name;
    this.editor.setContent(user.bio);
    this.initialBio = user.bio;
    this.initialName = user.name;
    if (user.cover) { this.coverPreview = this.http.getImageUrl(user.cover); }
    this.refreshFabDisplay();
  }

  onNameTab(e: Event) {
    e.preventDefault();
    this.editor.contentDiv?.nativeElement.focus();
  }

  onInputFocus() {
    this.mainNav.hideFab();
  }

  onInputBlur() {
    this.mainNav.showFab();
  }

  formIsValid(): boolean {
    return (this.name) ? true : false;
  }

  async submit(): Promise<void> {
    if (! this.formIsValid() || ! this.somethingHasBeenEdited()) {
      throw new Error("submit should not be callable if one input is empty or if nothing has changed");
    }
    await this.http.editUser(
      this.user!.id,
      this.nameHasChanged() ? this.name : undefined,
      this.bioHasChanged() ? this.editor.content : undefined,
      this.cover,
    );
    setTimeout(() => this.router.navigateByUrl(
      `/ideas/user/${this.user!.id}`,
      {skipLocationChange: true}
    ), 100); // otherwise doesn't refresh for some reason
  }

  onCoverChange(file: File) {
    this.cover = file;
    this.coverPreview = URL.createObjectURL(file);
    this.refreshFabDisplay();
  }

  refreshFabDisplay() {
    if (this.formIsValid() && this.somethingHasBeenEdited()) {
      this.mainNav.enableFab();
    } else {
      this.mainNav.disableFab();
    }
  }

  somethingHasBeenEdited(): boolean {
    return this.coverHasChanged() || this.nameHasChanged() || this.bioHasChanged();
  }

  nameHasChanged(): boolean {
    return this.name !== this.initialName;
  }

  bioHasChanged(): boolean {
    return this.editor.content !== this.initialBio;
  }

  coverHasChanged(): boolean {
    return this.cover !== undefined;
  }

}
