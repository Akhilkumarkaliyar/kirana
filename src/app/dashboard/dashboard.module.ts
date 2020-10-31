import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "../shared/directives/match-height.directive";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Dashboard1Component } from "./dashboard1/dashboard1.component";
//import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import {AppuserComponent} from './appuser/appuser.component';
import {CreateUserComponent} from './create-user/create-user.component';
import {ProductComponent} from './product/product.component';
import {CreateProductComponent} from './create-product/create-product.component';
import { CKEditorModule } from 'ngx-ckeditor';
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
import {ViewinvoiceComponent} from './view-invoice/view-invoice.component';
import {PaymentComponent} from './payment/payment.component';
import {VendorbillComponent} from './vendorbill/vendorbill.component';
import {CreateVendorBillComponent} from './create-vendor-bill/create-vendor-bill.component';
import {CreateVendorPaymentComponent} from './create-vendor-payment/create-vendor-payment.component';
import { CustomersalesComponent } from './customersales/customersales.component';
import { CustomerdeatilComponent } from './customerdeatil/customerdeatil.component';
import { DupviewinvoiceComponent } from './dup-view-invoice/dup-view-invoice.component';
//import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        ReactiveFormsModule, 
        FormsModule,
        CKEditorModule,
        //BarecodeScannerLivestreamModule
    ],
    exports: [],
    declarations: [
        Dashboard1Component,
        AppuserComponent,
        CreateUserComponent,
        ProductComponent,
        CreateProductComponent,
        ContactComponent,
        CreateContactComponent,
        BlogComponent,
        CreateBlogComponent,
        CategoryComponent,
        CreateCategoryComponent,
        SubCategoryComponent,
        CreateSubCategoryComponent,
        TestimonialComponent,
        CreateTestimonialComponent,
        SocialComponent,
        CreateSocialComponent,
        CreateFaqComponent,
        MetaComponent,
        CreateMetaComponent,
        OfferComponent,
        CreateOfferComponent,
        ServicesComponent,
        CreateServicesComponent,
        CarrierComponent,
        CreateCarrierComponent,
        AddtocartComponent,
        ReviewComponent,
        SoldproductComponent,
        ComingproductComponent,
        ExpireproductComponent,
        AvailableproductComponent,
        TodaySoldComponent,
        ExpirethismonthComponent,
        BillingComponent,
        InvoiceComponent,
        CmsComponent,
        CreateCmsComponent,
        NosaleComponent,
        SlowsaleComponent,
        AutoorderComponent,
        WholesalerComponent,
        CreateWholesalerComponent,
        ViewinvoiceComponent,
        PaymentComponent,
        VendorbillComponent,
        CreateVendorBillComponent,
        CreateVendorPaymentComponent,
        CustomersalesComponent,
        CustomerdeatilComponent,
        DupviewinvoiceComponent
    ],
    providers: [],
})
export class DashboardModule { }
