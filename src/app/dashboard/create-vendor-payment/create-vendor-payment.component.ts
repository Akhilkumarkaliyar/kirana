import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-vendor-payment',
    templateUrl: './create-vendor-payment.component.html',
    styleUrls: ['./create-vendor-payment.component.scss']
})

export class CreateVendorPaymentComponent implements OnInit{
    showbutton: boolean;
    id: any;
    VendorpaymentForm: FormGroup;
    showErrorMsg: string;
    vendordata : any;
    descen: any;
    loguser :any;
    //baseurl : any;
    startpagevalue:0;
    paymentdate:any;
    payment_date:any;
    paymedate:any;
    bill_id:any;
    billno:any;
   constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getvendorbill();
            //this.getbill(id);
            this.getvendor();
            this.showbutton = true;
            this.paymentdate=new Date();
            console.log(this.id);
            this.VendorpaymentForm = new FormGroup({
                vendor_id: new FormControl("", [Validators.required]),
                bill_id: new FormControl("", [Validators.required]),
                payment_date: new FormControl(""),
                amount: new FormControl("", [Validators.required]),
                mode: new FormControl("", [Validators.required]),
            });
        }
    }
    getvendor(){
        this.appservice.wholesaler(this.loguser,0)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.vendordata = data.data;
                 }
            }
        );
    }
    getbill(id){
        this.appservice.getbills(id)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.bill_id = data.data;
                }
            }
        );
    }
    getvendorbill(){
        this.appservice.vendorpaymentDetail(this.id,this.loguser)
            .subscribe(
              data=>{
                    if(data.status=='1')
                    {
                    
                        this.showErrorMsg = "";
                        this.paymentdate=data.data[0].payment_date;
                        this.billno=data.data[0].bill_id.split(',');
                        console.log(this.billno);
                        this.VendorpaymentForm = new FormGroup({
                        vendor_id: new FormControl(data.data[0].vendor_id, [Validators.required]),
                        bill_id: new FormControl(this.billno, [Validators.required]),
                        payment_date: new FormControl(data.data[0].payment_date),
                        amount: new FormControl(data.data[0].amount, [Validators.required]),
                        mode: new FormControl(data.data[0].mode, [Validators.required]),
                    });
                    this.getbill(data.data[0].vendor_id);
                      
                  }else{
                      this.showbutton = false;
                  }
              }
          );
    }
    /*createvendorpayment(){
        if(this.VendorpaymentForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.VendorpaymentForm.valid){
            this.loaderservice.display(true);
            this.paymedate=document.getElementById("payment_date");
            this.appservice.addvendorpayment(this.VendorpaymentForm.value,this.loguser,this.paymedate.value)
            .subscribe(
                data=>{
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/payment']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/payment']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
            //console.log(this.UserForm.value);
        }
    }*/
    editvendorpayment(){
        if(this.VendorpaymentForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.VendorpaymentForm.valid){
            this.loaderservice.display(true);
            this.paymedate=document.getElementById("payment_date");
            this.appservice.editvendorpayment(this.VendorpaymentForm.value,this.id,this.loguser,this.paymedate.value)
            .subscribe(
                data=>{
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/payment']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/payment']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/payment']);
    }
}


