import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

    private authUser: any;

    constructor(private auth: AuthService) { 
        this.auth.userData$.subscribe((res:any) => {
            this.authUser = res;
        });
    }
    
    intercept( request: HttpRequest<any>, next: HttpHandler ):Observable<HttpEvent<any>> {
       
        if (request.url.includes('/seguranca/login/tenant') || request.url.includes('/mobile/auth/signin')) {
            return next.handle(request);
        }

        request = request.clone({
            setHeaders: {
                'X-Customtoken': this.authUser.token
            }
        });

        return next.handle(request);
    }

    ngOnInit() {
        
    }
}