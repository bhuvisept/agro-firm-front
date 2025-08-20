import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AboutUsComponent } from './about-us/about-us.component'
import { ContactUsComponent } from './contact-us/contact-us.component'
import { PagesComponent } from './pages.component'
import { GalleryComponent } from './gallery/gallery.component'
import { OurProductsComponent } from './our-products/our-products.component'
import { NewsEventComponent } from './news-event/news-event.component'

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: 'about-us',component: AboutUsComponent,},
      {path: 'contact-us',component: ContactUsComponent,},
      {path: 'our-gallery',component: GalleryComponent,},
      {path: 'product',component: OurProductsComponent,},
      {path : 'news-events', component:NewsEventComponent,}
     
    ],
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
