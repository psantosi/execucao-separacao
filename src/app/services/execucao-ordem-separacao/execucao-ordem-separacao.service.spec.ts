import { TestBed } from '@angular/core/testing';

import { ExecucaoOrdemSeparacaoService } from './execucao-ordem-separacao.service';

describe('ExecucaoOrdemSeparacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExecucaoOrdemSeparacaoService = TestBed.get(ExecucaoOrdemSeparacaoService);
    expect(service).toBeTruthy();
  });
});
