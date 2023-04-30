import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HScrollComponent } from './h-scroll.component';

describe('HScrollComponent', () => {
  let component: HScrollComponent;
  let fixture: ComponentFixture<HScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HScrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
