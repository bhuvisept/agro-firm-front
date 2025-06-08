import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ProductListComponent} from './product-list/product-list.component'
import{ProductViewComponent} from './product-view/product-view.component'
import{ProductCartComponent} from './product-cart/product-cart.component'
import{ProductCheckoutComponent} from './product-checkout/product-checkout.component'
import { ProductCategoryComponent } from './product-category/product-category.component'
import { ContactSellerComponent } from './contact-seller/contact-seller.component'
import { RatingComponentComponent } from './rating-component/rating-component.component';


const routes: Routes = [
  {path:'',component:ProductCategoryComponent},
  {path:'products-list/:id',component:ProductListComponent},
  {path:'product-view/:id',component:ProductViewComponent},
  // {path:'cart',component:ProductCartComponent},
  // {path:'checkout',component:ProductCheckoutComponent},
  // {path:'contact/:id',component:ContactSellerComponent},  
  {path : 'rating/:token/:sellerId',component:RatingComponentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECommerceRoutingModule { }
