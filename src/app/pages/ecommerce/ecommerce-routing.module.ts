import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';
import { ProductViewComponent } from './product-view/product-view.component';



const routes: Routes = [
  {
    path: '', component:CategoryComponent
  },
  {
    path:'products/:id',component:ProductsComponent
  },
  {
    path:'product-view/:id',component:ProductViewComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
