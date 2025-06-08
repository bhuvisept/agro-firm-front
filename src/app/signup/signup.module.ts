import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SignupRoutingModule } from './signup-routing.module'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatDialogModule, MatInputModule, MatNativeDateModule, MatSelectModule } from '@angular/material'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { CompanySignupComponent } from './company-signup/company-signup.component'
import { UserSignupComponent } from './user-signup/user-signup.component'
import { NgxMaskModule } from 'ngx-mask'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { SellerSignupComponent } from './seller-signup/seller-signup.component'
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
@NgModule({
  declarations: [CompanySignupComponent, UserSignupComponent, SellerSignupComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    MatInputModule,
    ToastrModule,
    HttpClientModule,
    MatInputModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      } as RecaptchaSettings,
    }
  ],
})
export class SignupModule {}
