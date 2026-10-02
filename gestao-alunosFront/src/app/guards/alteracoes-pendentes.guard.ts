import { CanDeactivateFn } from '@angular/router';

export interface AlteracoesPendentes {
  possuiAlteracoesPendentes: boolean;
}

export const alteracoesPendentesGuard: CanDeactivateFn<AlteracoesPendentes> = (component) => {
  if (!component.possuiAlteracoesPendentes) {
    return true;
  }

  return window.confirm('Existem alterações não salvas. Deseja sair sem salvar?');
};