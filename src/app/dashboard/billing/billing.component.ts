import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})

export class BillingComponent implements OnInit {
    Billingdata: any;
    Totalprice :any;
    loguser:any;
    id:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        //console.log(JSON.parse(this.cookieservice.get("loginuserMerck")).id);
        this.id = this.route.snapshot.paramMap.get('id');
        this.getbillingdata();
    }

    getbillingdata() {
        this.appservice.billingdata(this.loguser,this.id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1'){
                        this.Billingdata = data.data;
                        this.Totalprice =data.total
                    }
                }
            );
    }
    deletebillingdata(id){
        this.appservice.deletebilling(id,this.loguser,this.id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.Billingdata = data.data;
                        this.Totalprice =data.total
                        this.toasterservice.Success(data.message);  
                        this.router.navigate(['/billing']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/billing']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }
    discrequantity(id,product_id){
        this.appservice.discrequantity(id,product_id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.Billingdata = data.data;
                        this.Totalprice =data.total
                        this.toasterservice.Success(data.message);  
                        this.router.navigate(['/billing']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/billing']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    } 
    genratebill(id){
        this.appservice.genratebill(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);  
                        this.router.navigate(['/billing']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/billing']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }

}
