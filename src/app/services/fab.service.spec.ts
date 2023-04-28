import { TestBed } from '@angular/core/testing';

import { FabService } from './fab.service';

describe('FabService', () => {
  let service: FabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
