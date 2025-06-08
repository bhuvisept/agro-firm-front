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
import { BooknowEventConfirmationDialogComponent } from './booknow-event-confirmation-dialog/booknow-event-confirmation-dialog.component'
import { CreatePostConfirmationDialogComponent } from './create-post-confirmation-dialog/create-post-confirmation-dialog.component'
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
import { EditPostConfirmationDialogComponent } from './edit-post-confirmation-dialog/edit-post-confirmation-dialog.component'
import { SharePostConfirmationDialogComponent } from './share-post-confirmation-dialog/share-post-confirmation-dialog.component'
import { CreateGroupPostConfirmationDialogComponent } from './create-group-post-confirmation-dialog/create-group-post-confirmation-dialog.component'
import { EditGroupPostConfirmationDialogComponent } from './edit-group-post-confirmation-dialog/edit-group-post-confirmation-dialog.component'
import { DeletePostConfirmationDialogComponent } from './delete-post-confirmation-dialog/delete-post-confirmation-dialog.component'
import { RejectInvitationComponent } from './reject-invitation/reject-invitation.component'
import { ExpiredInvitationComponent } from './expired-invitation/expired-invitation.component'
import { DeleteGroupPostConfirmationDialogComponent } from './delete-group-post-confirmation-dialog/delete-group-post-confirmation-dialog.component'
import { InvitationResetPasswordComponent } from './invitation-reset-password/invitation-reset-password.component'
import { EventBookDialogComponent } from './event-book-dialog/event-book-dialog.component'
import { TotalCommentDialogComponent } from './total-comment-dialog/total-comment-dialog.component'
import { GroupPostTotalCommentDialogComponent } from './group-post-total-comment-dialog/group-post-total-comment-dialog.component'
import { RecommendedDeclineInvitaionComponent } from './recommended-decline-invitaion/recommended-decline-invitaion.component'
import { RecommendedAcceptInvitaionComponent } from './recommended-accept-invitaion/recommended-accept-invitaion.component'
import { environment } from 'src/environments/environment'
import { VerifyOtpComponent } from './verify-otp/verify-otp.component'
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha'
import { MatRadioModule } from '@angular/material/radio'
import { SetProfileComponent } from './set-profile/set-profile.component'
import { CarouselModule } from 'ngx-owl-carousel-o'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ReportPostComponent } from './report-post/report-post.component'
import { CreateGroupComponent } from './create-group/create-group.component'
import { SliderImgComponent } from './slider-img/slider-img.component'
import { ProfileRedirectComponent } from './profile-redirect/profile-redirect.component'
import { AcceptRejectJobComponent } from './accept-reject-job/accept-reject-job.component'
import { DeclineJobOfferComponent } from './decline-job-offer/decline-job-offer.component'
import { ChangePasswordComponent } from './change-password/change-password.component'
import { PlanConfirmationDialogComponent } from '../app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from '../app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'
import { QueryFormConfirmationDialogComponent } from './query-form-confirmation-dialog/query-form-confirmation-dialog.component'
import { PaymentPageComponent } from './payment-page/payment-page.component'
import { NgxStripeModule } from 'ngx-stripe'
import { PaymentSuccessDialogComponent } from './payment-success-dialog/payment-success-dialog.component'
import { ChatPageComponent } from './chat-window/chat-window.component'
import { UserListComponent } from './chat_files/user-list/user-list.component'
import { FileUploadModule } from 'ng2-file-upload'
import { DeleteCommentConfirmationComponent } from './delete-comment-confirmation/delete-comment-confirmation.component'

import { EditCommentComponent } from './edit-comment/edit-comment.component'
import { PagesModule } from '../app/pages/pages.module'
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'
import { GlobalErrorHandler } from './global-error-handler.service'
import { AddUserToChatComponent } from './add-user-to-chat/add-user-to-chat.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedService } from './service/shared.service'
import { NgxEmojiPickerModule } from 'ngx-emoji-picker'
import { HeaderComponent } from './layout/component/header/header.component'
import { LayoutModule } from '../app/layout/layout.module'
import { ChatDetailComponent } from './chat-detail/chat-detail.component'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { CustomPaymentComponent } from './custom-payment/custom-payment.component'

const config: SocketIoConfig = { url: environment.url, options: {} }

import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { UpdatePaymentComponent } from './update-payment/update-payment.component';
import { PermissionPolicyComponent } from './permission-policy/permission-policy.component'
import { AddCardComponent } from './addCard/addCard.component';
import { InstallmentConfirmationComponent } from './installment-confirmation/installment-confirmation.component';
import { TicketsModule } from './my-tickets/tickets/tickets.module'


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [			 
    AppComponent,
    BooknowEventConfirmationDialogComponent,
    ChatPageComponent,
    CreatePostConfirmationDialogComponent,
    EditPostConfirmationDialogComponent,
    SharePostConfirmationDialogComponent,
    CreateGroupPostConfirmationDialogComponent,
    EditGroupPostConfirmationDialogComponent,
    DeletePostConfirmationDialogComponent,
    DeleteCommentConfirmationComponent,
    EditCommentComponent,
    RejectInvitationComponent,
    ExpiredInvitationComponent,
    DeleteGroupPostConfirmationDialogComponent,
    InvitationResetPasswordComponent,
    EventBookDialogComponent,
    TotalCommentDialogComponent,
    GroupPostTotalCommentDialogComponent,
    RecommendedDeclineInvitaionComponent,
    RecommendedAcceptInvitaionComponent,
    VerifyOtpComponent,
    SetProfileComponent,
    ReportPostComponent,
    CreateGroupComponent,
    SliderImgComponent,
    ProfileRedirectComponent,
    AcceptRejectJobComponent,
    DeclineJobOfferComponent,
    UpdatePaymentComponent,
    ChangePasswordComponent,
    PlanConfirmationDialogComponent,
    UpgradeConfirmationDialogComponent,
    QueryFormConfirmationDialogComponent,
    PaymentPageComponent,
    PaymentSuccessDialogComponent,
    UserListComponent,
    EditCommentComponent,
    PagenotfoundComponent,
    AddUserToChatComponent,
    ChatDetailComponent,
    CustomPaymentComponent,
    PermissionPolicyComponent,
      AddCardComponent,
      InstallmentConfirmationComponent,
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
      apiKey: 'AIzaSyC0y2S4-iE2rHkYdyAsglz_qirv0UtpF1s',
      libraries: ['places'],
    }),
    SocketIoModule.forRoot(config),
    RecaptchaModule,  
    RecaptchaFormsModule,
    ImageCropperModule,
   NgxStripeModule.forRoot('pk_test_51HFJPzAbeKm8NUzZXthjPzMslRkheryDF4jNCX3bVPAVxHglFSpi4oGcQAlg1ulInuMuV6Le3Ju3aYN8V8XtTESr00gxpGCXH4'),
      PagesModule,
    NgxEmojiPickerModule,
    LayoutModule,
    MatSlideToggleModule,
    TicketsModule,
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
    BooknowEventConfirmationDialogComponent,
    CreatePostConfirmationDialogComponent,
    EditPostConfirmationDialogComponent,
    SharePostConfirmationDialogComponent,
    CreateGroupPostConfirmationDialogComponent,
    EditGroupPostConfirmationDialogComponent,
    DeletePostConfirmationDialogComponent,
    DeleteCommentConfirmationComponent,
    EditCommentComponent,
    DeleteGroupPostConfirmationDialogComponent,
    EventBookDialogComponent,
    TotalCommentDialogComponent,
    GroupPostTotalCommentDialogComponent,
    ReportPostComponent,
    CreateGroupComponent,
    SliderImgComponent,
    ProfileRedirectComponent,
    PlanConfirmationDialogComponent,
    UpgradeConfirmationDialogComponent,
    QueryFormConfirmationDialogComponent,
    PaymentSuccessDialogComponent,
    UserListComponent,
    AddUserToChatComponent,
    ChatDetailComponent,
    PermissionPolicyComponent,
    AddCardComponent,
    InstallmentConfirmationComponent,
  ],
exports:[ TicketsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
