import { NgModule } from '@angular/core';
import { AuthGuardService } from './services/auth-guard.service';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'response-reset',
    loadChildren: () => import('./response-reset/response-reset.module').then( m => m.ResponseResetPageModule)
  },
  {
    path: 'response-reset/:token',
    loadChildren: () => import('./response-reset/response-reset.module').then( m => m.ResponseResetPageModule)
  },
  {
    path: 'activate/:jwt',
    loadChildren: () => import('./activate/activate.module').then( m => m.ActivatePageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./tab/tab.module').then( m => m.TabPageModule),
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, paramsInheritanceStrategy: 'always' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
