import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { CompanySignupComponent } from './company-signup/company-signup.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import{SellerSignupComponent} from './seller-signup/seller-signup.component'


const routes: Routes = [
  {
    path:'',
    component:CompanySignupComponent
  },
  {path:'company-signup', component:CompanySignupComponent},
  {path:'user-signup', component:UserSignupComponent},
  {path:'seller-signup', component:SellerSignupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
