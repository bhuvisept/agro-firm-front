import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginAuthGuard } from '../app/guard/login-auth.guard'
import { AuthGuard } from '../app/guard/auth.guard'
import { PagenotfoundComponent } from '../app/pagenotfound/pagenotfound.component'

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then((m) => m.LoginModule), canActivate: [LoginAuthGuard] },
  { path: 'layout', loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule), canActivate: [AuthGuard] },
  { path: 'reset-password/:token', loadChildren: () => import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule) },
  { path: 'change-password', component: ChangePasswordComponent },
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: PagenotfoundComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
