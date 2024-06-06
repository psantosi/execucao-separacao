import { TestBed } from '@angular/core/testing';

import { ReconhecimentoVozService } from './reconhecimento-voz.service';

describe('ReconhecimentoVozService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReconhecimentoVozService = TestBed.get(ReconhecimentoVozService);
    expect(service).toBeTruthy();
  });
});
