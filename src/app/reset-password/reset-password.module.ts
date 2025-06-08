import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatInputModule } from '@angular/material'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { MatTabsModule } from '@angular/material/tabs'


@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    HttpClientModule, MatInputModule, NgxSpinnerModule, ToastrModule, MatTabsModule

  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResetPasswordModule { }
