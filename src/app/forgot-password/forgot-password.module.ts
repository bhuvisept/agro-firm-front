import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatInputModule } from '@angular/material'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { MatTabsModule } from '@angular/material/tabs'
import { NgxMaskModule } from 'ngx-mask'
@NgModule({
  declarations: [ForgotPasswordComponent, ],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatInputModule,
    ToastrModule, 
    HttpClientModule,
    MatInputModule,
    NgxSpinnerModule, 
    MatTabsModule,
    NgxMaskModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ForgotPasswordModule { }
