import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { PaginaInicialComponent } from './pages/pagina-inicial/pagina-inicial';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { alteracoesPendentesGuard } from './guards/alteracoes-pendentes.guard';
import { AlunoNovoComponent } from './pages/aluno-novo/aluno-novo';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'alunos/novo', component: AlunoNovoComponent, canActivate: [authGuard, adminGuard], canDeactivate: [alteracoesPendentesGuard] },
  { path: 'pagina-inicial', component: PaginaInicialComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
