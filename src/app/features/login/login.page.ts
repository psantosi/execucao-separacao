import { Credenciais } from '../../model/credenciais';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AuthConstants } from '../../config/auth-constants';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credenciais: Credenciais = {
    empresa: '',
    usuario: '',
    senha: '',
    captcha: ''
  };
  empresa: string;

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService, private toastService: ToastService) { }

  validateInputs() {
    let usuario = this.credenciais.usuario.trim();
    let senha = this.credenciais.senha.trim();
    let empresa = this.credenciais.empresa.trim();

    return (
      this.credenciais.usuario &&
      this.credenciais.senha &&
      this.credenciais.empresa &&
      usuario.length > 0 &&
      senha.length > 0 &&
      empresa.length > 0
    );
  }

  validarEmpresa() {

    if (!this.credenciais.empresa) {
      return;
    }

    this.authService.validarEmpresa(this.credenciais.empresa).subscribe(
      (res: any) => {
          this.empresa = res.nome;
          this.storageService.store(AuthConstants.EMPRESA, this.credenciais.empresa);
      },
      (error: any) => {
        this.credenciais.empresa = '';
        this.toastService.presentToast(this.credenciais.empresa + ' não encontrada!');
      }
    );
  }

  loginAction() {
    if (!this.validateInputs()) {
      this.toastService.presentToast('Por favor, preencha todos os campos');
      return;
    }

    let data: string = this.getCredenciais(this.credenciais);

    this.authService.login(this.credenciais.empresa, data).subscribe(
      (res: any) => {
        if (res) {
          this.storageService.store(AuthConstants.AUTH, res);
          this.router.navigate(['home']);
        } else {
          this.toastService.presentToast('Usuário ou senha inválida.');
        }
      },
      (error: any) => {
        this.toastService.presentToast('Ocorreu um erro inesperado');
      });
  }

  getCredenciais(credenciais: Credenciais): string {
    return 'j_username=' +  encodeURIComponent(credenciais.usuario) + 
            '&j_password=' + encodeURIComponent(credenciais.senha) + 
            '&j_captcha_response=' + encodeURIComponent(credenciais.captcha);
  }

  ngOnInit() {
  }

}
