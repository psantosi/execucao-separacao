
import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthConstants } from 'src/app/config/auth-constants';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData$ = new BehaviorSubject<any>([]);

  constructor(private httpService: HttpService, private storageService: StorageService, private router: Router) {
    this.storageService.get(AuthConstants.AUTH).then(res => {
      this.userData$.next(res);
    });
  }

  validarEmpresa(empresa) {
    return this.httpService.get(empresa + '/seguranca/login/tenant.action',  {});
  }

  getUserData() {
    this.storageService.get(AuthConstants.AUTH).then(res => {
      this.userData$.next(res);
    });
  }

  login(empresa: string, postData: string): Observable<any> {
    const options = {
      headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
      params: {appId: AuthConstants.AppId}
    };

    return this.httpService.post(empresa + '/mobile/auth/signin.action', postData, options);
  }

  logout() {
    this.storageService.removeStorageItem(AuthConstants.AUTH).then(res => {
      this.router.navigate(['/login']);
    });
  }
}