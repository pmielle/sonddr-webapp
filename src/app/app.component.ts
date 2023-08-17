import { Component, inject } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private api = inject(ApiService);

  constructor() {
    this.test();
  }

  async test() {
    console.log(await this.api.getGoals());
  }
}
