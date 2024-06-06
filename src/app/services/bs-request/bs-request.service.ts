import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthConstants } from 'src/app/config/auth-constants';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BsRequestService {

  private empresa: string;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.storageService.get(AuthConstants.EMPRESA).then((res) => {
      this.empresa = res;
    });
  }

  get(serviceName, options) {
    const url = `${environment.apiUrl}${this.empresa}/${serviceName}`;
    const reqOptions = Object.assign({
    }, options);

    return this.http.get(url, reqOptions);
  }

  post(serviceName, data, options) {
    const url = `${environment.apiUrl}${this.empresa}/${serviceName}`;
    const reqOptions = Object.assign({
      headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
    }, options);

    console.log(data);
    console.log(reqOptions);

    return this.http.post(url, data, reqOptions);
  }

  put(serviceName, data, options) {
    const url = `${environment.apiUrl}${this.empresa}/${serviceName}`;
    const reqOptions = Object.assign({
      headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
    }, options);

    return this.http.put(url, data, reqOptions);
  }

  ngOnInit() {
  }
}
