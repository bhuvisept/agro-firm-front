import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AboutUsComponent } from './about-us/about-us.component'
import { BlogsComponent } from './blogs/blogs.component'
import { ContactUsComponent } from './contact-us/contact-us.component'
import { EventsComponent } from './events/events.component'
import { PagesComponent } from './pages.component'
import { ServicesComponent } from './services/services.component'
import { EventDetailsComponent } from './event-details/event-details.component'
import { PricingPageComponent } from './pricing-page/pricing-page.component'
import{BlogDetailsComponent} from './blog-details/blog-details.component'
import{ServicesDetailComponent} from './services-detail/services-detail.component'
import{PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component'
import{TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component'
import { PaymentComponent } from './payment/payment.component'
import { PlanCartComponent } from './plan-cart/plan-cart.component'
import { TripPlannerComponent } from './trip-planner/trip-planner.component';
import { FaqComponent } from './faq/faq.component';
import { UpgradePlanComponent } from './upgrade-plan/upgrade-plan.component'
import { TermsConditionComponent } from './terms-condition/terms-condition.component'
import { InstallmentPaymentComponent } from './installmentPayment/installmentPayment.component'
// import { CardComponent } from './card/card.component'

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: 'about-us',component: AboutUsComponent,},
      {path: 'services',component: ServicesComponent,},
      {path: 'services-detail/:id',component: ServicesDetailComponent,},
      {path: 'event-details/:id',component: EventDetailsComponent,},
      {path: 'events',component: EventsComponent,},
      {path: 'pricing-page',component: PricingPageComponent,},
      { path: 'search-job', loadChildren: () => import('./jobs/jobs.module').then((m) => m.JobsModule) },
      {path: 'blogs',component: BlogsComponent,},
      {path: 'blogs-details/:id',component: BlogDetailsComponent,},
      {path: 'privacy-policy',component: PrivacyPolicyComponent,},
      {path: 'terms-conditions',component: TermsAndConditionsComponent,},
      {path: 'contact-us',component: ContactUsComponent,},
      { path : 'plan-cart' ,component : PlanCartComponent},
      { path : "trip-plan" , component : TripPlannerComponent },
      { path : "faq" , component : FaqComponent },
      { path : "upgrade-my-plan/:planId" , component : UpgradePlanComponent },
      {path: 'terms-and-conditions',component: TermsConditionComponent},
      {path: 'installment-payment',component: InstallmentPaymentComponent},
      // {path: 'card',component: CardComponent},
      // { path : "upgrade/payment" , component : UpgradePlanComponent },
      { path: 'e-commerce', loadChildren: () => import('./e-commerce/e-commerce.module').then((m) => m.ECommerceModule) ,data: {breadcrumb: { skip: true }} },
    ],
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
