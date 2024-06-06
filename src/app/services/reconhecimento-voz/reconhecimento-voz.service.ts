import { Injectable, ApplicationRef } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx'
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { ExecucaoOrdemServicoView } from '../../model/execucaoOrdemServicoView';

@Injectable({
  providedIn: 'root'
})
export class ReconhecimentoVozService {

  escutando: boolean = false;
  volumeAtual: number;
  matches: string;

  constructor(private speechRecognition: SpeechRecognition,
              private audioman: AudioManagement) { }

  public iniciarEscuta(dados: ExecucaoOrdemServicoView): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.escutando = true;this.audioman.getVolume(AudioManagement.VolumeType.MUSIC).then((result) => {
        this.volumeAtual = result.volume;  
        this.abaixarVolume();
        this.escutar(dados, resolve, reject);
      });
    });

    return promise;
  }

  public 

  private escutar(dados: ExecucaoOrdemServicoView, resolve, reject): void {
    let options = {
      showPopup: false
    }

    this.speechRecognition.startListening(options).subscribe(
      (matches) => {
        this.escutando = false;
        this.aumentarVolume();
        this.obterResposta(dados, matches[0]);
        this.validarMensagem(matches[0].toLocaleLowerCase(), dados, resolve, reject);
      },
      error => {
        this.escutar(dados, resolve, reject);
      }
    );
  }

  private obterResposta(dados: ExecucaoOrdemServicoView, resposta: string) {
    dados.log = resposta;
  }

  private obterTipoResposta(resposta: string, tipoResposta:string) {
    const tiposRespostas = {
      rua: [`rua ${resposta}`, `${resposta}`, `${resposta} confirma`, `${resposta} pronto`],
      confirmacao: ['pronto', 'confirma', 'ok'],
      smart: [`${resposta} pronto`, `${resposta}`, `${resposta} confirma`, `${resposta} ok`],
      quantidade: [`${resposta} pronto`, `${resposta}`, `${resposta} confirma`, `${resposta} ok`],
      positivoNegativo: ['sim', 'não'],
      unitizador: [resposta]
    }

    return tiposRespostas[tipoResposta];
  }


  private validarMensagem(match: string, dados: ExecucaoOrdemServicoView, resolve, reject) {
    let possiveisRespostas = this.obterTipoResposta(dados.resposta, dados.tipoResposta)
    
    if (possiveisRespostas.includes(match)) {
      dados.respostaDoUsuario = match;
      resolve(dados);
    } else if ((dados.tipoResposta === 'quantidade' || dados.tipoResposta === 'unitizador') && match.match(/\d+/g)) {
      dados.respostaDoUsuario = match;
      resolve(dados);
    } else {
      reject(dados);
    }
  }

  private abaixarVolume() {
    this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, 0).then(() => {}, () => {});
    this.audioman.setVolume(AudioManagement.VolumeType.NOTIFICATION, 0).then(() => {}, () => {});
  }

  private aumentarVolume() {
    this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.volumeAtual).then(() => {}, () => {});
    this.audioman.setVolume(AudioManagement.VolumeType.NOTIFICATION, this.volumeAtual).then(() => {}, () => {});
  }
}
