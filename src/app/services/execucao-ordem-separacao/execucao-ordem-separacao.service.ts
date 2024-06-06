import { Injectable } from '@angular/core';
import { BsRequestService } from '../bs-request/bs-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecucaoOrdemSeparacaoService {

  constructor(private bsRequestService: BsRequestService) { }

  obterOrdemServico(): Observable<any> {
    return this.bsRequestService.get('api/execucao-ordem-servico/ordem-servico', {});
  }

  iniciarOrdemCarga(wmsOrdemServicoKey: number, wmsCargaKey: number): Observable<any> {
    return this.bsRequestService.put(`api/execucao-ordem-servico/iniciar/ordem-servico/${wmsOrdemServicoKey}/carga/${wmsCargaKey}`, {}, {});
  }

  obterProximaSeparacaoPorPreUnitizador(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/separacao-pre-unitizador', options);
  }

  validarUnitizador(params):Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/validar-pre-unitizador', options);
  }

  obterProximaSeparacaoPorRua(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/separacao-rua', options);
  }

  obterProximaSeparacaoPorColuna(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/separacao-coluna', options);
  }

  obterProximaSeparacaoPorNivel(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/separacao-nivel', options);
  }

  obterProximaSeparacaoPorProduto(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/separacao-produto', options);
  }

  obterProximaSeparacaoQuantidade(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.get('api/execucao-ordem-servico/separacao-quantidade', options);
  }

  salvar(data: any): Observable<any> {
    const options = {
      headers: {'Content-Type' : 'application/json'}
    }

    return this.bsRequestService.post('api/execucao-ordem-servico/salvar', data, options);
  }

  cortar(data: any): Observable<any> {
    const options = {
      headers: {'Content-Type' : 'application/json'}
    }
    
    return this.bsRequestService.post('api/execucao-ordem-servico/cortar', data, options);
  }

  finalizar(params: any): Observable<any> {
    const options = {
      params: params
    };

    return this.bsRequestService.post('api/execucao-ordem-servico/finalizar', {}, options);
  }

}
