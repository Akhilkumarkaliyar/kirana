import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';
@Component({
    selector: 'app-expireproduct',
    templateUrl: './expireproduct.component.html',
    styleUrls: ['./expireproduct.component.scss']
})

export class ExpireproductComponent implements OnInit {
    Expireproductdata: any;
    excelbaseurl:any;
    pno:any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    loguser:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService, private excelService:ExcelService  ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getExpireproductdata();
    }

    getExpireproductdata() {
        this.appservice.expireproductdata(this.startpagevalue,10,this.loguser)
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Expireproductdata = data.data;
                        //this.excelbaseurl=sessionStorage.getItem("excelurl");
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }else{
                        this.Expireproductdata ='';
                        this.totalRecords = '';
                     }
                }
            );
    }
    deleteexpireproductdata(id){
        this.appservice.deleteexpireproduct(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/expireproduct']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/expireproduct']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }
    handleChange(en){
        this.pno=en-1;
         this.appservice.expireproductdata(this.pno,10,this.loguser)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.Expireproductdata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =en;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.Expireproductdata, 'sample');
     }
     getrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.appservice.expireproductdata(this.startpagevalue,this.totalrecord.value,this.loguser)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.Expireproductdata = data.data;
                    if(this.totalrecord.value == 10){
                        this.totalRecords = data.record;
                    }else{
                        this.totalRecords = '';
                    }
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }
            }
        );
    }

}
