import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit {

  @Input() mensagem: string;
  logs: string[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.criarLogs();
  }

  criarLogs(): void {
    if (!this.logs.length || this.logs.length === 1 || this.logs.length === 2) {
      this.logs.push(this.mensagem);
    } 

    this.logs[0] = this.logs[1];
    this.logs[1] = this.logs[2];
    this.logs[2] = this.mensagem;
  }

  ngOnInit() {}

}
