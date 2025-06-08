import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { MyEventsComponent } from './component/my-events/my-events.component'
import { LayoutComponent } from './layout.component'
import { MyJobsComponent } from './component/my-jobs/my-jobs.component'
import { MyWishlistComponent } from './component/my-wishlist/my-wishlist.component'
import { GpsComponent } from './component/gps/gps.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    pathMatch: 'prefix',
    children: [
      { path: 'gps', component: GpsComponent },
      { path: 'my-jobs', component: MyJobsComponent },
      { path: 'my-event', component: MyEventsComponent },
      { path: 'wish-list', component: MyWishlistComponent },
      { path: 'driver', loadChildren: () => import('../driver/driver.module').then((m) => m.DriverModule) },
      { path: 'myaccount', loadChildren: () => import('../company/company.module').then((m) => m.CompanyModule) },
      { path: 'e-commerce', loadChildren: () => import('../e-commerce/e-commerce.module').then((m) => m.ECommerceModule) },
      { path: 'social-media', loadChildren: () => import('../social-media/social-media.module').then((m) => m.SocialMediaModule) },
      { path: 'notification', loadChildren: () => import('../notification/notification.module').then((m) => m.NotificationModule) },
    ],
  },
]

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class LayoutRoutingModule {}
