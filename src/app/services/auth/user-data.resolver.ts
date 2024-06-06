import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
   providedIn: 'root'
})

export class UserDataResolver {
    constructor(private authService: AuthService) {}

    resolve() {
        return this.authService.getUserData();
    }

}