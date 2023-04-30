import { Component, Input } from '@angular/core';
import { Goal } from 'src/app/interfaces/goal';

@Component({
  selector: 'app-goal-chip',
  templateUrl: './goal-chip.component.html',
  styleUrls: ['./goal-chip.component.scss']
})
export class GoalChipComponent {

  // attributes
  // --------------------------------------------
  @Input('goal') goal!: Goal;
  @Input('no-label') noLabel: boolean = false;
}
