import { HomeService } from '../../services/home/home.service';
import { Component } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  empresa$: string;
  authUser;

  constructor(private homeService: HomeService, private storageService: StorageService, private iab: InAppBrowser) {
    this.storageService.get(AuthConstants.EMPRESA).then(res => {
      this.empresa$ = res;
    });
  }

  irParaErp(url) {
    this.homeService.logarUsuario().subscribe(
      () => {
        this.iab.create(`${environment.apiUrl}${this.empresa$}${url}`);
      }
    );
  }
  
  ngOnInit() {
        
  }

}
