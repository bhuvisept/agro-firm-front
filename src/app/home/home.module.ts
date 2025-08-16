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
import { PagesModule } from '../pages/pages.module'
import { TranslateModule } from '@ngx-translate/core';
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
  entryComponents :[ ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class HomeModule { }
