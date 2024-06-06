import { TestBed } from '@angular/core/testing';

import { FalarService } from './falar.service';

describe('FalarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FalarService = TestBed.get(FalarService);
    expect(service).toBeTruthy();
  });
});
