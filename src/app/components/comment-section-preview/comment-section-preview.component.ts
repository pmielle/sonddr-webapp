import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { Comment } from 'sonddr-shared';
import { SortBy } from '../idea-list/idea-list.component';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-comment-section-preview',
  templateUrl: './comment-section-preview.component.html',
  styleUrls: ['./comment-section-preview.component.scss']
})
export class CommentSectionPreviewComponent {

  // dependencies
  // --------------------------------------------
  time = inject(TimeService);

  // I/O
  // --------------------------------------------
  @Input('comment') comment?: Comment;
  @Input('total-nb') totalNb?: number;
  @Output("sort-by-change") sortByChange = new EventEmitter<SortBy>();
  @Output('see-more') seeMore = new EventEmitter<void>();

  // attributes
  // --------------------------------------------
  sortBy: SortBy = "recent";
  header?: string;

  // lifecycle hooks
  // --------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes["comment"];
    if (!change) { return; }
    let comment = change.currentValue;
    this.header = this.chooseHeader(comment);
  }

  // methods
  // --------------------------------------------
  makeLabel(): string {
    if (!this.totalNb) { return ''; }
    if (this.totalNb <= 1) { return ''; }
    const otherNb = this.totalNb - 1;
    const plural = otherNb > 1;
    return `See ${otherNb} other comment${plural ? 's' : ''}`;

  }

  updateSortBy(sortBy: SortBy) {
    this.sortBy = sortBy;
    this.sortByChange.next(sortBy);
  }

  chooseHeader(comment?: Comment): string|undefined {
    if (!comment) { return undefined; }
    if (this.sortBy === "recent") {
      const now = new Date();
      const aDayAgo = this.time.getNDaysBefore(now, 1);
      const aWeekAgo = this.time.getNDaysBefore(now, 7);
      return comment.date > aDayAgo 
        ? "Today"
        : comment.date > aWeekAgo
        ? "This week"
        : ""
    } else {
      return "Top 10";
    }

  }

}
