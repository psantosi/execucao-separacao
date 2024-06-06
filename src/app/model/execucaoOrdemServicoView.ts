export class ExecucaoOrdemServicoView {

  
  constructor(
    public mensagem: string,
    public resposta: string,
    public respostaDoUsuario: string,
    public tipoResposta: string,
    public log: string,
    public callbackSucesso: Function,
    public callbackErro: Function) {
  }
}