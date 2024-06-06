import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private storageService: StorageService) {
  }

  get(serviceName, options) {
    const url = environment.apiUrl + serviceName;
    return this.http.get(url, options);
  }

  post(serviceName, data, options) {
    const url = `${environment.apiUrl}${serviceName}`;
    return this.http.post(url, data, options);
  }         
}
