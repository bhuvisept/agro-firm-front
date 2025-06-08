import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeComponent } from './home.component';
import { GeneralServiceService } from '../core/general-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component';
import { PagesModule } from '../pages/pages.module'
import { TranslateModule } from '@ngx-translate/core';
import { PromosPopupComponent } from '../pages/promos-popup/promos-popup.component';
@NgModule({
  declarations: [HomeComponent ,HeaderComponent, FooterComponent, HomePageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    HttpClientModule,
    PagesModule,
    TranslateModule

  ],
  providers: [GeneralServiceService, NgxSpinnerService,DatePipe ],
  entryComponents :[LoginDialogComponent , PromosPopupComponent ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class HomeModule { }
