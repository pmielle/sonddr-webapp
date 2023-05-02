import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaViewComponent } from './idea-view.component';

describe('IdeaViewComponent', () => {
  let component: IdeaViewComponent;
  let fixture: ComponentFixture<IdeaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeaViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
