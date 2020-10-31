import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import {AppuserComponent} from './appuser/appuser.component';
import {CreateUserComponent} from './create-user/create-user.component';
import {ProductComponent} from './product/product.component';
import {CreateProductComponent} from './create-product/create-product.component';
import {ContactComponent} from './contact/contact.component';
import {CreateContactComponent} from './create-contact/create-contact.component';
import {BlogComponent} from './blog/blog.component';
import {CreateBlogComponent} from './create-blog/create-blog.component';
import {CategoryComponent} from './category/category.component';
import {CreateCategoryComponent} from './create-category/create-category.component';
import {SubCategoryComponent } from './subcategory/subcategory.component';
import {CreateSubCategoryComponent} from './create-subcategory/create-subcategory.component';
import {TestimonialComponent} from './testimonial/testimonial.component';
import {CreateTestimonialComponent} from './create-testimonial/create-testimonial.component';
import {SocialComponent} from './social/social.component';
import {CreateSocialComponent} from './create-social/create-social.component';
import {CreateFaqComponent} from './create-faq/create-faq.component';
import {MetaComponent} from './meta/meta.component';
import {CreateMetaComponent} from './create-meta/create-meta.component';
import {OfferComponent} from './offer/offer.component'; 
import {CreateOfferComponent} from './create-offer/create-offer.component';
import {ServicesComponent} from './services/services.component';
import {CreateServicesComponent} from './create-services/create-services.component';
import {CarrierComponent} from './carrier/carrier.component';
import {CreateCarrierComponent} from './create-carrier/create-carrier.component';
import {AddtocartComponent} from './addtocart/addtocart.component';
import {ReviewComponent} from './review/review.component';
import {SoldproductComponent} from './soldproduct/soldproduct.component';
import {ComingproductComponent} from './comingproduct/comingproduct.component';
import {ExpireproductComponent} from './expireproduct/expireproduct.component';
import {AvailableproductComponent} from './availableproduct/availableproduct.component';
import {TodaySoldComponent} from './todaysold/todaysold.component';
import {ExpirethismonthComponent} from './expirethismonth/expirethismonth.component';
import {BillingComponent} from './billing/billing.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {CmsComponent} from './cms/cms.component';
import {CreateCmsComponent} from './create-cms/create-cms.component';
import {NosaleComponent} from './nosale/nosale.component';
import {SlowsaleComponent} from './slowsale/slowsale.component';
import {AutoorderComponent} from './autoorder/autoorder.component';
import {WholesalerComponent} from './wholesaler/wholesaler.component';
import {CreateWholesalerComponent} from './create-wholesaler/create-wholesaler.component';
import {ViewinvoiceComponent } from './view-invoice/view-invoice.component';
import {PaymentComponent} from './payment/payment.component';
import {VendorbillComponent} from './vendorbill/vendorbill.component';
import {CreateVendorBillComponent} from './create-vendor-bill/create-vendor-bill.component';
import {CreateVendorPaymentComponent} from './create-vendor-payment/create-vendor-payment.component';
import { CustomersalesComponent } from './customersales/customersales.component';
import { CustomerdeatilComponent } from './customerdeatil/customerdeatil.component';
import {DupviewinvoiceComponent } from './dup-view-invoice/dup-view-invoice.component';

const routes: Routes = [
  {
    path: '',
    children: [
     
      {
        path: 'dashboard',
        component: Dashboard1Component,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'appuser',
        component: AppuserComponent,
        data: {
          title: 'App user'
        }
      },
      {
        path: 'create-user/:id',
        component: CreateUserComponent,
        data: {
          title: 'Create User'
        }
      },
      {
        path: 'product',
        component: ProductComponent,
        data: {
          title: 'Product list'
        }
      },
      {
        path: 'autoorder',
        component: AutoorderComponent,
        data: {
          title: 'Product list'
        }
      },
      {
        path: 'wholesaler',
        component: WholesalerComponent,
        data: {
          title: 'Wholesaler list'
        }
      },
      {
        path: 'create-wholesaler/:id',
        component: CreateWholesalerComponent,
        data: {
          title: 'Add Wholesaler'
        }
      },
      {
        path: 'create-product/:id',
        component: CreateProductComponent,
        data: {
          title: 'Add Product'
        }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: {
          title: 'Contact list'
        }
      },
      {
        path: 'create-contact/:id',
        component: CreateContactComponent,
        data: {
          title: 'Add Contact'
        }
      },
      {
        path: 'blog',
        component: BlogComponent,
        data: {
          title: 'Blog list'
        }
      },
      {
        path: 'create-blog/:id',
        component: CreateBlogComponent,
        data: {
          title: 'Add Blog'
        }
      }, 
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: 'Category list'
        }
      },
      {
        path: 'create-category/:id',
        component: CreateCategoryComponent,
        data: {
          title: 'Add Category'
        }
      }, 
      {
        path: 'subcategory',
        component: SubCategoryComponent,
        data: {
          title: 'SubCategory list'
        }
      },
      {
        path: 'create-subcategory/:id',
        component: CreateSubCategoryComponent,
        data: {
          title: 'Add SubCategory'
        }
      },
      {
        path: 'testimonial',
        component: TestimonialComponent,
        data: {
          title: 'Testimonial list'
        }
      },
      {
        path: 'create-testimonial/:id',
        component: CreateTestimonialComponent,
        data: {
          title: 'Add Testimonial'
        }
      },
      {
        path: 'social',
        component: SocialComponent,
        data: {
          title: 'Social list'
        }
      },
      {
        path: 'create-social/:id',
        component: CreateSocialComponent,
        data: {
          title: 'Add Social'
        }
      },
      {
        path: 'cms',
        component: CmsComponent,
        data: {
          title: 'Cms list'
        }
      },
      {
        path: 'create-cms/:id',
        component: CreateCmsComponent,
        data: {
          title: 'Add Cms'
        }
      },
      {
        path: 'create-faq/:id',
        component: CreateFaqComponent,
        data: {
          title: 'Add Faq'
        }
      },
      {
        path: 'meta',
        component: MetaComponent,
        data: {
          title: 'Meta list'
        }
      },
      {
        path: 'create-meta/:id',
        component: CreateMetaComponent,
        data: {
          title: 'Add Meta'
        }
      }, 
      { 
        path: 'offer',
        component: OfferComponent,
        data: {
          title: 'Offer list'
        }
      },
      {
        path: 'create-offer/:id',
        component: CreateOfferComponent,
        data: {
          title: 'Add Offer'
        }
      },
      { 
        path: 'services',
        component: ServicesComponent,
        data: {
          title: 'Services list'
        }
      },
      {
        path: 'create-services/:id',
        component: CreateServicesComponent,
        data: {
          title: 'Add Services'
        }
      },
      { 
        path: 'carrier',
        component: CarrierComponent,
        data: {
          title: 'Carrier list'
        }
      },
      { 
        path: 'create-carrier/:id',
        component: CreateCarrierComponent,
        data: {
          title: 'Add Carrier'
        }
      },
      { 
        path: 'addtocart',
        component: AddtocartComponent,
        data: {
          title: 'Add to cart list'
        }
      }, 
      { 
        path: 'review',
        component: ReviewComponent,
        data: {
          title: 'Review list'
        }
      },
      { 
        path: 'soldproduct',
        component: SoldproductComponent,
        data: {
          title: 'Sold Product list'
        }
      },
      { 
        path: 'comingproduct',
        component: ComingproductComponent,
        data: {
          title: 'Coming Product list'
        }
      },
      { 
        path: 'expireproduct',
        component: ExpireproductComponent,
        data: {
          title: 'Expire Product list'
        }
      },
      { 
        path: 'availableproduct',
        component: AvailableproductComponent,
        data: {
          title: 'Available Product list'
        }
      }, 
      { 
        path: 'todaysold',
        component: TodaySoldComponent,
        data: {
          title: 'Today Sold list'
        }
      },
      {  
        path: 'expirethismonth',
        component: ExpirethismonthComponent,
        data: {
          title: 'Expire this month list'
        }
      },
      { 
        path: 'billing',
        component: BillingComponent,
        data: {
          title: 'Billing System'
        }
      },  
      { 
        //path: 'chemist/invoice',
        path: 'kirana/invoice/:id',
        component: InvoiceComponent,
        data: {
          title: 'Invoice'
        }
      },
      {
        path: 'nosale',
        component: NosaleComponent,
        data: {
          title: 'Record Page'
        }
      },
      {
        path: 'slowsale',
        component: SlowsaleComponent,
        data: {
          title: 'Record Page'
        }
      },
      
      { 
        path: 'payment',
        component: PaymentComponent,
        data: {
          title: 'payment'
        }
      },
      { 
        path: 'vendorbill',
        component: VendorbillComponent,
        data: {
          title: 'Vendor bill'
        }
      },
      {
        path: 'create-vendorbill/:id',
        component: CreateVendorBillComponent,
        data: {
          title: 'Add Vendor Bill'
        }
      },
      {
        path: 'viewinvoice/:id',
        component: ViewinvoiceComponent,
        data: {
          title: 'ReView Bill'
        }
      },
      {
        path: 'dupviewinvoice/:id',
        component: DupviewinvoiceComponent,
        data: {
          title: 'ReView Bill'
        }
      },
      {
        path: 'create-vendorpayment/:id',
        component: CreateVendorPaymentComponent,
        data: {
          title: 'Add Vendor Payment'
        }
      },
      {
        path: 'customerdetail/:id',
        component: CustomerdeatilComponent,
        data: {
          title: 'Customer Detail'
        }
      },
      { 
        path: 'customersales',
        component: CustomersalesComponent,
        data: {
          title: 'Customer Sales Report'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
