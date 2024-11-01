import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { AddressComponent } from './components/address/address.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CreateEmployeeComponent } from './admin-panel/create-employee/create-employee.component';
import { EmployeeListComponent } from './admin-panel/employee-list/employee-list.component';
import { AddProductComponent } from './admin-panel/add-product/add-product.component';
import { BrandManagementComponent } from './admin-panel/brand-management/brand-management.component';
import { CreateTypeComponent } from './admin-panel/create-type/create-type.component';
import { ProductListComponent } from './admin-panel/product-list/product-list.component';
import { UpdateProductComponent } from './admin-panel/update-product/update-product.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'product', component: ProductComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'productdetail/:productName/:productId', component: ProductDetailComponent },
    { path: 'my-profile', component: MyProfileComponent },
    { path: 'user/account/address', component: AddressComponent },
    { path: 'admin-login', component: AdminLoginComponent },
    { path: 'admin-panel', component: AdminPanelComponent },
    { path: 'employees', component: EmployeeListComponent },
    { path: 'employees/create', component: CreateEmployeeComponent },
    { path: 'products/add', component: AddProductComponent },
    { path: 'admin-panel/manage-brands', component: BrandManagementComponent },
    { path: 'create-type', component: CreateTypeComponent },
    { path: 'product-list', component: ProductListComponent },
    { path: 'admin-panel/update-product/:id', component: UpdateProductComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export { routes }; // Xuất biến routes
