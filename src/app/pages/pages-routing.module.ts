import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AboutUsComponent } from './about-us/about-us.component'
import { ContactUsComponent } from './contact-us/contact-us.component'
import { PagesComponent } from './pages.component'
// import { CardComponent } from './card/card.component'

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: 'about-us',component: AboutUsComponent,},
      {path: 'contact-us',component: ContactUsComponent,},
     
    ],
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
