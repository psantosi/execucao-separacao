import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExecucaoOrdemSeparacaoPageRoutingModule } from './execucao-ordem-separacao-routing.module';
import { ExecucaoOrdemSeparacaoPage } from './execucao-ordem-separacao.page';
import { MonitorComponent } from '../../components/monitor/monitor.component';
import { BarcodeComponent } from '../../components/barcode/barcode.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExecucaoOrdemSeparacaoPageRoutingModule
  ],
  declarations: [ExecucaoOrdemSeparacaoPage, MonitorComponent, BarcodeComponent]
})
export class ExecucaoOrdemSeparacaoPageModule {}
