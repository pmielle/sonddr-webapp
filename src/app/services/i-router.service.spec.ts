import { TestBed } from '@angular/core/testing';

import { IRouterService } from './i-router.service';

describe('IRouterService', () => {
  let service: IRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
