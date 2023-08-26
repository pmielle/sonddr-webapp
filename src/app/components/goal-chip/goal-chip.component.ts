import { Component, Input, inject } from '@angular/core';
import { Goal } from 'sonddr-shared';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-goal-chip',
  templateUrl: './goal-chip.component.html',
  styleUrls: ['./goal-chip.component.scss']
})
export class GoalChipComponent {

  // dependencies
  // --------------------------------------------
  color = inject(ColorService);

  // attributes
  // --------------------------------------------
  @Input('goal') goal!: Goal;
  @Input('no-label') noLabel: boolean = false;
}