import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsViewComponent } from './notifications-view.component';

describe('NotificationsViewComponent', () => {
  let component: NotificationsViewComponent;
  let fixture: ComponentFixture<NotificationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
