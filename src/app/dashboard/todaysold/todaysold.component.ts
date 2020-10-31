import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-todaysold',
    templateUrl: './todaysold.component.html',
    styleUrls: ['./todaysold.component.scss']
})

export class TodaySoldComponent implements OnInit {
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
    d:any;
    today :any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    startdate:any;
    enddate:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService, private excelService:ExcelService ){}
    ngOnInit() {
        this.d =new Date();
        this.today =this.d.getFullYear() + "-" + (this.d.getMonth()+1) + "-" + this.d.getDate();
        this.endValue = this.d.getFullYear() + "-" + (this.d.getMonth()+1) + "-" + (this.d.getDate()-1);
        this.startValue =this.d.getFullYear() + "-" + (this.d.getMonth()+1) + "-" + (this.d.getDate()-2);
        //console.log(this.endValue);
        //console.log(this.startValue);
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getTodaySold();
        this.startdate=this.startValue;
        this.enddate=this.endValue;
    }

    getTodaySold() {
        this.appservice.getreport(this.startValue,this.endValue,this.startpagevalue,10)
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.TodaySolddata = data.data;
                        //this.excelbaseurl=sessionStorage.getItem("excelurl");
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }
                }
            );
    }
    getsalesreport(){
        this.startDateValue=document.getElementById("startdate");
        this.endDateValue=document.getElementById("enddate");
        this.appservice.getreport(this.startDateValue.value,this.endDateValue.value,this.startpagevalue,10)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.TodaySolddata = data.data;
                   // this.excelbaseurl=sessionStorage.getItem("excelurl");
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }else{
                    this.TodaySolddata = data.data;
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
      
}
