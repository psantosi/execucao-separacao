import { Injectable } from '@angular/core';
import { BsRequestService } from '../bs-request/bs-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private bsRequestService: BsRequestService) { 

  }

  logarUsuario(): Observable<any> {
    return this.bsRequestService.post('api/seguranca/logarUsuario', {}, {});
  }
}
