import { ReconhecimentoVozService } from '../../services/reconhecimento-voz/reconhecimento-voz.service';
import { Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx'
import { FalarService } from '../../services/falar/falar.service';
import { ExecucaoOrdemServicoView } from '../../model/execucaoOrdemServicoView';
import { ExecucaoOrdemSeparacaoService } from '../../services/execucao-ordem-separacao/execucao-ordem-separacao.service';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-execucao-ordem-separacao',
  templateUrl: './execucao-ordem-separacao.page.html',
  styleUrls: ['./execucao-ordem-separacao.page.scss'],
})
export class ExecucaoOrdemSeparacaoPage implements OnInit {

  public authUser: any;
  public isEscutando = false;
  public volumeAtual: number;
  public item: any = '';
  public log: string;
  public ordemServico: any;
  public iconeBotaoVoice = 'mic-off-outline';
  public voiceAtivo = true;
  public form = {
    endereco: '',
    gtin: '',
    quantidade: 0,
    unitizador: ''
  };

  constructor(private speechRecognition: SpeechRecognition,
              private falarService: FalarService, 
              private reconhecimentoVozService: ReconhecimentoVozService,
              private execucaoOrdemSeparacaoService: ExecucaoOrdemSeparacaoService,
              private audioman: AudioManagement,
              private toastService: ToastService) {
    
  }

  public toggleVoice() {
    if (this.voiceAtivo) {
      this.isEscutando = false;
      this.voiceAtivo = false;
      this.iconeBotaoVoice = 'mic-outline';
      this.falarService.pararFala();
      this.speechRecognition.stopListening();
      this.toastService.presentToast('Voice Picking desativado!');
    } else {
      this.voiceAtivo = true;
      this.iconeBotaoVoice = 'mic-off-outline';
      this.toastService.presentToast('Voice Picking ativado!');
      this.iniciar();
    }
  }

  public iniciar() {
    if (this.voiceAtivo) {
      this.aumentarVolume();
      this.logarMensagem(`Bem-vindo ${this.ordemServico.operador}! Ordem serviço ${this.ordemServico.wmsOrdemServicoKey}`);
      this.falarService.falar(`Bem-vindo ${this.ordemServico.operador}! Ordem serviço ${this.ordemServico.wmsOrdemServicoKey}`);
    }

    this.iniciarOrdemECarga()
  }

  private obterOrdemDoOperador(iniciar: boolean) {
    this.execucaoOrdemSeparacaoService.obterOrdemServico().subscribe((res) => {
      this.ordemServico = res
      
      if (iniciar) {
        this.iniciar();
      }
    });
  }


  private aumentarVolume() {
    this.audioman.setVolume(AudioManagement.VolumeType.MUSIC,10);
    this.audioman.setVolume(AudioManagement.VolumeType.NOTIFICATION, 10);
  }

  private iniciarOrdemECarga() {
    this.execucaoOrdemSeparacaoService.iniciarOrdemCarga(this.ordemServico.wmsOrdemServicoKey, this.ordemServico.wmsCargaKey).subscribe(() => this.obterProximaSeparacaoPorPreUnitizador(0));
  }
  
  private obterProximaSeparacaoPorPreUnitizador(logisticaLoteItemKey): void {
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: logisticaLoteItemKey,
      wmsCargaKey: this.ordemServico.wmsCargaKey
    };

    this.execucaoOrdemSeparacaoService.obterProximaSeparacaoPorPreUnitizador(params).subscribe(
      (res) => {
        this.item = res;

        let dados = new ExecucaoOrdemServicoView(
          res.mensagem,
          res.resposta,
          '',
          'positivoNegativo', 
          '',
          () => this.solicitarUnitizador(),
          () => this.obterRua()
        );

        this.reconhecerVoz(dados);
      }
    );
  }

  private solicitarUnitizador(): void {
    let dados = new ExecucaoOrdemServicoView(
      'Diga o unitizador',
      '',
      '',
      'unitizador', 
      '',
      () => this.validarUnitizador(dados),
      () => this.validarUnitizador(dados)
    );


    this.reconhecerVoz(dados);
  }

  private validarUnitizador(dados) {
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey,
      wmsCargaKey: this.ordemServico.wmsCargaKey,
      wmsUnitizadorKey: dados.respostaDoUsuario,
      destinatarioKey: this.ordemServico.destinatarioKey
    };  

    this.execucaoOrdemSeparacaoService.validarUnitizador(params).subscribe(
      () => {
        this.form.unitizador = dados.respostaDoUsuario;
        this.obterRua();
      }, (e) => {
        this.logarMensagem(e.error.erros[0].mensagem);
        this.falarService.falar(e.error.erros[0].mensagem).then(() => {
          this.solicitarUnitizador();
        });
      }
    );
  };

  private obterRua(): void {
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey
    };

    this.execucaoOrdemSeparacaoService.obterProximaSeparacaoPorRua(params).subscribe(
      (res) => {
        let dados = new ExecucaoOrdemServicoView(
          res.mensagem,
          res.resposta,
          '',
          'rua', 
          '',
          () => this.obterColuna(),
          () => this.obterRua()
        );
    
        this.reconhecerVoz(dados);
      }
    );
  }

  private obterColuna(): void {
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey
    };

    this.execucaoOrdemSeparacaoService.obterProximaSeparacaoPorColuna(params).subscribe(
      (res) => {
        let dados = new ExecucaoOrdemServicoView(
          res.mensagem,
          res.resposta,
          '',
          'confirmacao', 
          '',
          () => this.obterNivel(),
          () => this.obterColuna()
        );
    
        this.reconhecerVoz(dados);
      }
    );
  }

  private obterNivel(): void {
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey
    };

    this.execucaoOrdemSeparacaoService.obterProximaSeparacaoPorNivel(params).subscribe(
      (res) => {
        let dados = new ExecucaoOrdemServicoView(
          res.mensagem,
          res.resposta,
          '',
          'smart', 
          '',
          () => this.obterProduto(),
          () => this.obterNivel()
        );
    
        this.reconhecerVoz(dados);
      }
    );
  }

  private obterProduto(): void {
    this.form.endereco = this.item.enderecoLogisticoDescritivo;

    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey,
      lojaKey: this.ordemServico.lojaKey
    };

    this.execucaoOrdemSeparacaoService.obterProximaSeparacaoPorProduto(params).subscribe(
      (res) => {
        let dados = new ExecucaoOrdemServicoView(
          res.mensagem,
          res.resposta,
          '',
          'smart', 
          '',
          () => this.obterQuantidade(),
          () => this.obterProduto()
        );
    
        this.reconhecerVoz(dados);
      }
    );
  }

  private obterQuantidade(): void {
    this.form.gtin = this.item.gtin;

    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey,
    };

    this.execucaoOrdemSeparacaoService.obterProximaSeparacaoQuantidade(params).subscribe(
      (res) => {
        let dados = new ExecucaoOrdemServicoView(
          res.mensagem,
          res.resposta,
          '',
          'quantidade', 
          '',
          () => this.validarQuantidade(dados),
          () => this.obterQuantidade()
        );
    
        this.reconhecerVoz(dados);
      }
    );
  }

  private validarQuantidade(dados: ExecucaoOrdemServicoView): void {
    let quantidade = Number(dados.respostaDoUsuario.match(/\d+/g)[0]);

    if (Number(dados.resposta) === quantidade) {
      this.salvar(quantidade);
    } else if (Number(dados.resposta) > quantidade) {
      this.validarCorte(quantidade);
    } else {
      this.logarMensagem('Quantidade inválida!');
      this.falarService.falar('Quantidade inválida!').then(() => this.obterQuantidade());
    }
  }

  private validarCorte(quantidade: number) {
    let dados = new ExecucaoOrdemServicoView(
      'Quantidade menor! Deseja cortar?',
      '',
      '',
      'positivoNegativo', 
      '',
      () => this.validarRespostaCorte(dados, quantidade),
      () => this.validarCorte(quantidade)
    );

    this.reconhecerVoz(dados);
  }

  private validarRespostaCorte(dados: ExecucaoOrdemServicoView, quantidade: number): void {
    if (dados.respostaDoUsuario === 'sim') {
      this.cortar(quantidade);
    } else {
      this.logarMensagem('Então');
      this.falarService.falar('Então').then(() => this.obterQuantidade());
    }
  }

  public cortar(quantidade: number): void {
    this.form.quantidade = quantidade;

    const data = this.obterFormParaSalvar(quantidade);

    this.execucaoOrdemSeparacaoService.cortar(data).subscribe(
      () => {
        this.toastService.presentToast('Item cortado com sucesso!');
        this.logarMensagem('Item cortado com sucesso!');
        this.falarService.falar('Item cortado com sucesso!');
        this.irParaProximo();
      }
    );
    
  }

  public salvar(quantidade: number): void {
    this.form.quantidade = quantidade;

    const data = this.obterFormParaSalvar(quantidade);

    this.execucaoOrdemSeparacaoService.salvar(data).subscribe(
      () => {
        this.toastService.presentToast('Item separado com sucesso!');
        this.logarMensagem('Item separado com sucesso!');
        this.falarService.falar('Item separado com sucesso!');
        this.irParaProximo();
      }
    );

  }

  private limparCampos() {
    for (let campo in this.form) {
      this.form[campo] = '';
    }
  }

  public irParaProximo() {
    this.limparCampos();

    if (parseInt(this.item.proximo)) {
      this.logarMensagem('Próximo item');
      this.falarService.falar('Próximo item');
      this.obterProximaSeparacaoPorPreUnitizador(this.item.proximo);
    } else {
      this.item = null;
      this.finalizar();
    }
  }

  private finalizar() {
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      wmsCargaKey: this.ordemServico.wmsCargaKey
    }

    this.execucaoOrdemSeparacaoService.finalizar(params).subscribe(
      () => {
        this.toastService.presentToast('Ordem de serviço finalizada');
        this.logarMensagem('Ordem de serviço finalizada');
        this.falarService.falar('Ordem de serviço finalizada');
        this.obterOrdemDoOperador(true);
      }
    );
  }

  private obterFormParaSalvar(quantidade: number) {
    return {
      quantidade: quantidade,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey,
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      wmsUnitizadorItemKey: this.item.wmsUnitizadorItemKey,
      preUnitizadorKey: this.form.unitizador,
      box: this.ordemServico.box,
      wmsAtividadeKey: this.ordemServico.atividadeKey,
      novoPalete: false,
      wmsCargaKey: this.ordemServico.wmsCargaKey,
      lojaOrigem: this.ordemServico.lojaKey,
      destinatarioKey: this.ordemServico.destinatarioKey,
      unitizadorSeparado: false
    };
  }

  private async reconhecerVoz (dados: ExecucaoOrdemServicoView) {
    if (!this.voiceAtivo) return;
    this.logarMensagem(dados.mensagem);
   
    this.falarService.falar(dados.mensagem).then(() => {
      if (!this.voiceAtivo) return;
      this.isEscutando = true;
     
      this.reconhecimentoVozService.iniciarEscuta(dados).then(
        (response: ExecucaoOrdemServicoView) => {
          this.obterCallbackSucesso(response, dados);
        }, (response: ExecucaoOrdemServicoView) => {
          this.obterCallbackErro(response, dados);
        });
    });
  }

  private obterCallbackErro(response: ExecucaoOrdemServicoView, dados: ExecucaoOrdemServicoView) {
    this.logarResposta(response.log);
    this.logarMensagem('Resposta inválida!');
    this.falarService.falar('Resposta inválida!').then(() => {
      dados.callbackErro();
    });
  }

  private obterCallbackSucesso(response: ExecucaoOrdemServicoView, dados: ExecucaoOrdemServicoView) {
    this.logarResposta(response.log);
    if (response.tipoResposta === 'positivoNegativo' || response.tipoResposta === 'quantidade' || response.tipoResposta === 'unitizador') {
      this.isEscutando = false;
      dados.callbackSucesso();
    }
    else {
      this.logarMensagem('Correto!');
      this.falarService.falar('Correto!').then(() => {
        this.isEscutando = false;
        dados.callbackSucesso();
      });
    }
  }

  private logarMensagem(log: string): void {
    setTimeout(() => {
      this.log = 'Mensagem: ' + log;
    }, 500);
  }

  private logarResposta(log: string): void {    
    setTimeout(() => {
      this.log = 'Resposta: ' + log;
    }, 500);
  }

  private validarCampoUnitizador(wmsUnitizadorKey, campo) {;
    const params = {
      wmsOrdemServicoKey: this.ordemServico.wmsOrdemServicoKey,
      logisticaLoteItemKey: this.item.logisticaLoteItemKey,
      wmsCargaKey: this.ordemServico.wmsCargaKey,
      wmsUnitizadorKey: wmsUnitizadorKey,
      destinatarioKey: this.ordemServico.destinatarioKey
    };  

    this.execucaoOrdemSeparacaoService.validarUnitizador(params).subscribe(
      () => {
        
      }, (e) => {
        this.toastService.presentToast('Unitizador inválido!');
        this.form[campo] = '';
      }
    );
  };

  private validarCampoEndereco(endereco, campo) {
    if (endereco !== this.item.enderecoLogisticoDescritivo && endereco !== parseInt(this.item.enderecoLogisticoKey) && endereco !== this.item.digitoVerificador) {
      this.toastService.presentToast('Endereço inválido!');
      this.form[campo] = ''
      return;
    }

    this.form[campo] = this.item.enderecoLogisticoDescritivo;
  };

  private validarCampoGtin(gtin, campo) {
    if (parseInt(gtin) && parseInt(gtin) !== parseInt(this.item.gtin)) {
      this.toastService.presentToast('Gtin inváido!');
      this.form[campo] = ''
    }
  };

  public lerCondigoBarra(resultado, campo) {
    this.form[campo] = resultado.texto;

    switch(campo) {
      case 'unitizador': 
        this.validarCampoUnitizador(resultado.texto, campo);
        break;
      case 'endereco': 
        this.validarCampoEndereco(resultado.texto, campo);
        break;
      case 'gtin': 
        this.validarCampoGtin(resultado.texto, campo);
        break;
    }
  }
  
  ngOnInit() {
    this.speechRecognition.hasPermission()
      .then((temPermissao: boolean) => {
          if(!temPermissao) {
            this.speechRecognition.requestPermission();
          } 
      });
      
    this.obterOrdemDoOperador(false);      
  }

}
