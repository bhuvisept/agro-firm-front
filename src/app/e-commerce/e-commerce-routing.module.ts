import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ListProductComponent } from './list-product/list-product.component'
import { CreateProductComponent } from './create-product/create-product.component'
import { ViewProductComponent } from './view-product/view-product.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ViewProfileComponent } from './view-profile/view-profile.component'
import { EditProfileComponent } from './edit-profile/edit-profile.component'
import { AddProductTruckComponent } from './truck-form/add-product-truck/add-product-truck.component'
import { EditTruckComponent } from './truck-form/edit-truck/edit-truck.component'
import { AddTrailerComponent } from './trailer-from/add-trailer/add-trailer.component'
import { EditTrailerComponent } from './trailer-from/edit-trailer/edit-trailer.component'
import { AddSparepartsComponent } from './spareParts-form/add-spareparts/add-spareparts.component'
import { EditSparepartsComponent } from './spareParts-form/edit-spareparts/edit-spareparts.component'
import { AddAccessoriesComponent } from './accessories-form/add-accessories/add-accessories.component'
import { EditAccessoriesComponent } from './accessories-form/edit-accessories/edit-accessories.component'
import { BrandListComponent } from '../e-commerce/manage-product/brand/brand-list/brand-list.component'
import { ModelListComponent } from '../e-commerce/manage-product/model/model-list/model-list.component'
import { AddTruckUnitsComponent } from '../e-commerce/truck-units-form/add-truck-units/add-truck-units.component'
import { EditTruckUnitsComponent } from '../e-commerce/truck-units-form/edit-truck-units/edit-truck-units.component'
import { CategoryListComponent } from '../e-commerce/manage-product/category/category-list/category-list.component'
import { QuriesComponent } from '../e-commerce/quries/quries.component'
import { AddBrandComponent } from '../e-commerce/manage-product/brand/add-brand/add-brand.component'
import { AddCategoryComponent } from '../e-commerce/manage-product/category/add-category/add-category.component'
import { AddModelComponent } from '../e-commerce/manage-product/model/add-model/add-model.component'
import { QuesAnsComponent } from './ques-ans/ques-ans.component'
import { AnswerQuesComponent } from './answer-ques/answer-ques.component'
import { AddMisceProductComponent } from './miscellaneous-form/add-misce-product/add-misce-product.component'
import { EditMisceProductComponent } from './miscellaneous-form/edit-misce-product/edit-misce-product.component'
import { SupportComponent } from './support/support.component'
import { UpdateProfileComponent } from './update-profile/update-profile.component'
import { SellerRatingComponent } from './seller-rating/seller-rating.component'
import { CompanyToSellerComponent } from './company-to-seller/company-to-seller.component'
import { InviteTeamComponent } from './invite-team/invite-team.component'
import { MyPlanComponent } from './my-plan/my-plan.component'
import { NotificationComponent } from './notification/notification.component'
import { InstallmentListComponent } from './installmentList/installmentList.component'
import { CardComponent } from './card/card.component'
import { MyTicketsComponent } from './my-tickets/my-tickets.component'

const routes: Routes = [
  { path: '', component: ViewProfileComponent },
  { path: 'view-profile', component: UpdateProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-products-list', component: ListProductComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'product-view/:Id', component: ViewProductComponent },
  { path: 'add-truck/:id', component: AddProductTruckComponent },
  { path: 'edit-truck/:Id', component: EditTruckComponent },
  { path: 'add-trailer/:id', component: AddTrailerComponent },
  { path: 'edit-trailer/:Id', component: EditTrailerComponent },
  { path: 'add-truckunits/:id', component: AddTruckUnitsComponent },
  { path: 'edit-truckunits/:Id', component: EditTruckUnitsComponent },
  // { path: 'add-spareparts/:id', component: AddSparepartsComponent },
  // { path: 'edit-spareparts/:Id', component: EditSparepartsComponent },
  // { path: 'add-accessories/:id', component: AddAccessoriesComponent },
  // { path: 'edit-accessories/:Id', component: EditAccessoriesComponent },
  // { path: 'add-miscellaneous/:id', component: AddMisceProductComponent },
  // { path: 'edit-miscellaneous/:Id', component: EditMisceProductComponent },
  { path: 'brand-list', component: BrandListComponent },
  { path: 'add-brand', component: AddBrandComponent },
  { path: 'model-list', component: ModelListComponent },
  { path: 'add-model', component: AddModelComponent },
  { path: 'category-list', component: CategoryListComponent },
  { path: 'add-category', component: AddCategoryComponent },
  // { path: 'queries', component: QuriesComponent },
  { path: 'questions', component: QuesAnsComponent },
  { path: 'answer-question/:id', component: AnswerQuesComponent },
  { path: 'support', component: SupportComponent },
  { path: 'rating', component: SellerRatingComponent },
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'switch-account', component: CompanyToSellerComponent },
  { path: 'my-plan', component: MyPlanComponent },
  { path: 'invite-team', component: InviteTeamComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'installmentList', component: InstallmentListComponent },
  { path: 'card', component: CardComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ECommerceRoutingModule {}
