import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasViewComponent } from './ideas-view.component';

describe('IdeasViewComponent', () => {
  let component: IdeasViewComponent;
  let fixture: ComponentFixture<IdeasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeasViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
