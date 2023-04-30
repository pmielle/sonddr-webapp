import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalChipComponent } from './goal-chip.component';

describe('GoalChipComponent', () => {
  let component: GoalChipComponent;
  let fixture: ComponentFixture<GoalChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
