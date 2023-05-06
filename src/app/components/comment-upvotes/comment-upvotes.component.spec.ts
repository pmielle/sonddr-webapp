import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentUpvotesComponent } from './comment-upvotes.component';

describe('CommentUpvotesComponent', () => {
  let component: CommentUpvotesComponent;
  let fixture: ComponentFixture<CommentUpvotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentUpvotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentUpvotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
