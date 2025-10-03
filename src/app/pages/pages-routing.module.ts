import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AboutUsComponent } from './about-us/about-us.component'
import { ContactUsComponent } from './contact-us/contact-us.component'
import { PagesComponent } from './pages.component'
import { GalleryComponent } from './gallery/gallery.component'
import { OurProductsComponent } from './our-products/our-products.component'
import { NewsEventComponent } from './news-event/news-event.component'
import { NewsDetailComponent } from './news-detail/news-detail.component'
import { OurServiceDetailComponent } from './our-service-detail/our-service-detail.component'
import { OurServicesComponent } from './our-services/our-services.component'

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'about-us', component: AboutUsComponent, },
      { path: 'contact-us', component: ContactUsComponent, },
      { path: 'our-gallery', component: GalleryComponent, },
      { path: 'product', component: OurProductsComponent, },
      { path: 'news-events', component: NewsEventComponent, },
      { path: 'news-detail/:id', component: NewsDetailComponent },
      { path : 'ecommerce',loadChildren: () => import('./ecommerce/ecommerce.module').then((m)=>m.EcommerceModule)},
      { path : 'our-service-detail/:id',component:OurServiceDetailComponent},
      { path : 'our-services',component:OurServicesComponent}
    ],
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
