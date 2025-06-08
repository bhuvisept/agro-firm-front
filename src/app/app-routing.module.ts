import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ExpiredInvitationComponent } from './expired-invitation/expired-invitation.component'
import { RejectInvitationComponent } from './reject-invitation/reject-invitation.component'
import { InvitationResetPasswordComponent } from './invitation-reset-password/invitation-reset-password.component'
import { RecommendedDeclineInvitaionComponent } from './recommended-decline-invitaion/recommended-decline-invitaion.component'
import { RecommendedAcceptInvitaionComponent } from './recommended-accept-invitaion/recommended-accept-invitaion.component'
import { VerifyOtpComponent } from './verify-otp/verify-otp.component'
import { SetProfileComponent } from './set-profile/set-profile.component'
import { AcceptRejectJobComponent } from './accept-reject-job/accept-reject-job.component';
import { DeclineJobOfferComponent } from './decline-job-offer/decline-job-offer.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PaymentPageComponent } from './payment-page/payment-page.component'
import { ChatPageComponent } from './chat-window/chat-window.component'
import { LoginAuthGuard } from '../app/guard/login-auth.guard'
import { AuthGuard } from '../app/guard/auth.guard'
import { PagenotfoundComponent } from '../app/pagenotfound/pagenotfound.component'
import { CustomPaymentComponent } from './custom-payment/custom-payment.component'
import { UpdatePaymentComponent } from './update-payment/update-payment.component'

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then((m) => m.LoginModule), canActivate: [LoginAuthGuard] },
  { path: 'expired-invitation', component: ExpiredInvitationComponent },
  { path: 'layout', loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule), canActivate: [AuthGuard] },
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then((m) => m.SignupModule), canActivate: [LoginAuthGuard] },
  { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule) },
  { path: 'reset-password/:token', loadChildren: () => import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule) },
  { path: 'create-password/:token', component: InvitationResetPasswordComponent },
  { path: 'decline-invitaion/:token', component: RejectInvitationComponent },
  { path: 'recommended-decline-invitaion/:token', component: RecommendedDeclineInvitaionComponent },
  { path: 'recommended-accept-invitaion/:token', component: RecommendedAcceptInvitaionComponent },
  { path: 'verify-otp/:token', component: VerifyOtpComponent },
  { path: 'set-profile', component: SetProfileComponent },
  { path: 'chat-window', component: ChatPageComponent },
  { path: 'acceptOffer/:token', component: AcceptRejectJobComponent },
  { path: 'declineOffer/:token', component: DeclineJobOfferComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'payment', component: PaymentPageComponent },
  { path: 'custom-payment/:token', component: CustomPaymentComponent },
  { path: 'update-payment/:planId',component:UpdatePaymentComponent},
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: PagenotfoundComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
