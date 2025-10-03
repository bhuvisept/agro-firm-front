import { BrowserModule } from '@angular/platform-browser'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
//Required
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { MatInputModule, MatProgressBarModule } from '@angular/material'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { NgSelectModule } from '@ng-select/ng-select'
//services

//Component
import { MatStepperModule } from '@angular/material/stepper'
import { GeneralServiceService } from './core/general-service.service'
import { AgmCoreModule } from '@agm/core'
import { NgxMaskModule } from 'ngx-mask'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'
import {
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatSelectModule,
  MatDialogModule,
  MatDatepickerModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatCheckboxModule,
} from '@angular/material'
import { environment } from 'src/environments/environment'
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha'
import { MatRadioModule } from '@angular/material/radio'
import { CarouselModule } from 'ngx-owl-carousel-o'
import { ImageCropperModule } from 'ngx-image-cropper'
import { SliderImgComponent } from './slider-img___/slider-img.component'
import { ChangePasswordComponent } from './change-password/change-password.component'
import { FileUploadModule } from 'ng2-file-upload'
import { PagesModule } from '../app/pages/pages.module'
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'
import { GlobalErrorHandler } from './global-error-handler.service'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedService } from './service/shared.service'
import { NgxEmojiPickerModule } from 'ngx-emoji-picker'
import { HeaderComponent } from './layout/component/header/header.component'
import { LayoutModule } from '../app/layout/layout.module'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

const config: SocketIoConfig = { url: environment.url, options: {} }

import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [			 
    AppComponent,
    SliderImgComponent,
    ChangePasswordComponent,
    PagenotfoundComponent    
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    FileUploadModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    NgSelectModule,
    Ng2SearchPipeModule,
    MatRadioModule,
    MatProgressBarModule,
    InfiniteScrollModule,
    ToastrModule.forRoot(),
    MatStepperModule,
    NgxMaskModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: '',
      libraries: ['places'],
    }),
    SocketIoModule.forRoot(config),
    RecaptchaModule,  
    RecaptchaFormsModule,
    ImageCropperModule,
      PagesModule,
    NgxEmojiPickerModule,
    LayoutModule,
    MatSlideToggleModule,
    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] } }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    GeneralServiceService,
    NgxSpinnerService,
    SharedService,
    { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' } as RecaptchaSettings },
    HeaderComponent,
  ],
  entryComponents: [
    SliderImgComponent],
exports:[ ],
  bootstrap: [AppComponent],
})
export class AppModule {}
