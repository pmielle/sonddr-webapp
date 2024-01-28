import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest, from } from 'rxjs';
import { Goal, Idea } from 'sonddr-shared';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { EditorComponent } from 'src/app/components/editor/editor.component';

@Component({
  selector: 'app-add-view',
  templateUrl: './add-view.component.html',
  styleUrls: ['./add-view.component.scss']
})
export class AddViewComponent {

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
  ideas?: Idea[];
  goals?: Goal[];
  selectedGoals: Goal[] = [];
  selectableGoals: Goal[] = [];
  coverPreview?: string;
  title = "";
  cover?: File;
  @ViewChild(EditorComponent) editor!: EditorComponent;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {

    // get data
    this.mainSub = combineLatest([
      this.route.queryParamMap,
      from(this.http.getGoals()),
    ]).subscribe(([map, goals]) => {

      // get all goals
      this.goals = goals;
      this.selectableGoals = goals;

      // preselect a goal if query param
      const id = map.get("preselected");
      if (id) {
        const goal = goals.find(g => g.id === id);
        if (!goal) {
          throw new Error(`Failed to preselect ${id}: no matching goal found`);
        }
        this.selectGoal(goal);
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
  formIsValid(): boolean {
    return (this.editor.content && this.title && this.selectedGoals.length) ? true : false;
  }

  async submit(): Promise<void> {
    if (this.formIsValid()) {
      const id = await this.http.postIdea(
        this.title,
        this.editor.content,
        this.selectedGoals.map(g => g.id),
        this.cover,
        this.editor.images,
      );
      this.router.navigateByUrl(`/ideas/idea/${id}`, {replaceUrl: true});
    } else {
      throw new Error("submit should not be callable if one input is empty");
    }
  }

  onCoverChange(file: File) {
    this.cover = file;
    this.coverPreview = URL.createObjectURL(file);
  }

  refreshFabDisplay() {
    if (this.formIsValid()) {
      this.mainNav.enableFab();
    } else {
      this.mainNav.disableFab();
    }
  }

  selectGoal(goal: Goal) {
    // add it to selected list
    if (! this.selectedGoals.find(g => g.id === goal.id)) {
      this.selectedGoals.unshift(goal);
    }
    // remove it from selectable list
    const i = this.selectableGoals.findIndex(g => g.id === goal.id);
    if (i !== -1) {
      this.selectableGoals.splice(i, 1);
    }
    // refresh the fab display
    this.refreshFabDisplay();
  }

}
