import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeGuard } from './guards/home.guard';
import { IndexGuard } from './guards/index.guard';
import { UserDataResolver } from './services/auth/user-data.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { 
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then( m => m.HomePageModule),
    canActivate: [HomeGuard],
    resolve:{
      userData: UserDataResolver
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'execucao-ordem-separacao',
    loadChildren: () => import('./features/execucao-ordem-separacao/execucao-ordem-separacao.module').then( m => m.ExecucaoOrdemSeparacaoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
