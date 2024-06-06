import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExecucaoOrdemSeparacaoPage } from './execucao-ordem-separacao.page';

const routes: Routes = [
  {
    path: '',
    component: ExecucaoOrdemSeparacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecucaoOrdemSeparacaoPageRoutingModule {}
