import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-customerdeatil',
    templateUrl: './customerdeatil.component.html',
    styleUrls: ['./customerdeatil.component.scss']
})

export class CustomerdeatilComponent implements OnInit {
    TodaySolddata: any;
    Salereport:FormGroup;
    excelbaseurl:any;
    startValue: any;
    endValue:any;
    startDateValue:any;
    endDateValue:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    pno:any;
    id:any;
    today :any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    loguser:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService, private excelService:ExcelService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.id = this.route.snapshot.paramMap.get('id');
        this.getcustomerpurchase();
    }

    getcustomerpurchase() {
        this.appservice.getpurchasereport(this.loguser,this.id,this.startpagevalue,10)
            .subscribe(
                data => {
                    if(data.status=='1'){
                        console.log(data);
                        this.TodaySolddata = data.data;
                        //this.excelbaseurl=sessionStorage.getItem("excelurl");
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }
                }
            );
    }
    handleChange(en){
        this.pno=en-1;
        this.startDateValue=document.getElementById("startdate");
        this.endDateValue=document.getElementById("enddate");
        this.appservice.getreport(this.startDateValue.value,this.endDateValue.value,this.pno,10)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.TodaySolddata = data.data;
                   // this.excelbaseurl=sessionStorage.getItem("excelurl");
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =en;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.TodaySolddata, 'sample');
     }
     getrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.startDateValue=document.getElementById("startdate");
        this.endDateValue=document.getElementById("enddate");
        this.appservice.getreport(this.startDateValue.value,this.endDateValue.value,this.startpagevalue,this.totalrecord.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.TodaySolddata = data.data;
                   // this.excelbaseurl=sessionStorage.getItem("excelurl");
                    
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
    goToviewdetail(id){
        this.router.navigate(['/create-product', id]);
    }  
}
