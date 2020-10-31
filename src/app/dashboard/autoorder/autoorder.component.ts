import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-autoorder',
    templateUrl: './autoorder.component.html',
    styleUrls: ['./autoorder.component.scss']
})

export class AutoorderComponent implements OnInit {
    productdata: any;
    Wholesailer:any;
    wholeiddata:any;
    Billingdata:any;
    ProductSearch :FormGroup;
    loguser :any;
    sailerdetail :boolean=false;
    startpagevalue=0;
    constructor(private appservice: AppService, private route: Router, private cookieservice: CookieService, private toasterservice: ToasterService, private loaderservice: LoaderService) { 
        this.ProductSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck")) {
            this.route.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getProduct();
        this.getwholesailer();

    }

    getProduct() {
        this.appservice.orderproduct()
        .subscribe(
            data => {
                console.log(data);
                if (data.status == '1') {
                    this.productdata = data.data;
                    //this.wholeiddata = '';
                    //console.log(this.wholeiddata);
                    this.Billingdata = data.preor;
                }
            }
        );
    }
    getwholesailer() {
        this.appservice.wholesailer()
        .subscribe(
            data => {
                if (data.status == '1') {
                    this.Wholesailer = data.data;
                }
            }
        );
    }
    getwhole(whole_id){
        this.appservice.wholeDetail(whole_id)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.wholeiddata = data.data;
                    this.sailerdetail= true;
                }
            }
        );
    }
    getproductname(){
        this.loaderservice.display(true);
        this.appservice.productsearch(this.ProductSearch.value,this.loguser,this.startpagevalue,10,'name','ss')
        .subscribe(
            data => {
                if (data.status == '1') {
                    this.productdata = data.data; 
                }else if(data.status == '2'){ 
                    this.productdata =data.data;
                }
            }
        );
    } 
    autoorder(id){
        this.appservice.autoorder(id,this.loguser)
        .subscribe(
            data => {
                 if (data.status == '1') {
                    this.toasterservice.Success(data.message);
                    this.Billingdata = data.data;
                  }else if(data.status == '2'){ 
                    this.toasterservice.Error(data.message);
                    this.Billingdata = data.data;
                }
            }
        );
    }
    discrequantity(id,product_id){
        this.appservice.discrequantityorder(id,product_id)
        .subscribe(
            data => {
                console.log(data);
                if(data.status=='1')
                {
                    this.Billingdata = data.data;
                    this.toasterservice.Success(data.message);  
                    //this.router.navigate(['/billing']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    //this.router.navigate(['/billing']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
    } 
    increquantity(id,product_id){
        this.appservice.increquantityorder(id,product_id)
        .subscribe(
            data => {
                console.log(data);
                if(data.status=='1')
                {
                    this.Billingdata = data.data;
                    this.toasterservice.Success(data.message);  
                    //this.router.navigate(['/billing']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    //this.router.navigate(['/billing']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
    }
    placeorder(){
        
    }
}
