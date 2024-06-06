import { TestBed } from '@angular/core/testing';

import { BsRequestService } from './bs-request.service';

describe('BsRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BsRequestService = TestBed.get(BsRequestService);
    expect(service).toBeTruthy();
  });
});
