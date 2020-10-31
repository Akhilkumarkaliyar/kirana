import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-view-invoice',
    templateUrl: './view-invoice.component.html',
    styleUrls: ['./view-invoice.component.scss']
})

export class ViewinvoiceComponent implements OnInit {
    Billingdata: any;
    Tprice:any;
    Gst:any;
    Amount:any;
    loguser:any;
    id:any;
    address:any;
    add:any;
    username:any;
    mobile:any;
    billnos:any;
    billinfo:any;
    city:any;
    dname:any;
    licenceno:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    myDate = new Date();
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck") && !this.cookieservice.get("loginsuperuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.username =JSON.parse(this.cookieservice.get("loginuserMerck")).fname;
        this.address =JSON.parse(this.cookieservice.get("loginuserMerck")).address;
        this.licenceno =JSON.parse(this.cookieservice.get("loginuserMerck")).licenceno;
        this.city =JSON.parse(this.cookieservice.get("loginuserMerck")).city;
        this.mobile =JSON.parse(this.cookieservice.get("loginuserMerck")).mobile;
        this.getbillingdata();
    }

    getbillingdata() {
        this.appservice.viewbillingdata(this.loguser,this.id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1'){
                        this.Billingdata = data.data;
                        this.Tprice=data.total;
                        this.Gst=data.gst;
                        this.Amount=data.amount;
                        this.billinfo=data.billinfo;
                        this.add=this.address;
                        this.billnos =this.id;
                        this.myDate=new Date();
                        this.dname=this.username;
                        this.address=this.address;
                        this.licenceno=this.licenceno;
                    }
                }
            );
    }
    printPage() {
        //window.print();
        var prtContent = document.getElementById("vmmjhdk");
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }

}
