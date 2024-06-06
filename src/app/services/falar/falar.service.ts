import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Injectable({
  providedIn: 'root'
})
export class FalarService {

  volumeAtual: number;
  options;

  constructor(private tts: TextToSpeech) { 
    this.options = {
      locale: 'pt-BR',
      rate: 1
    }
  }

  public async falar(mensagem: string) {
    this.options.text = mensagem;
    return await this.tts.speak(this.options);
  }

  public pararFala() {
    this.tts.stop();
  }

}
