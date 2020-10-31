import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-customersales',
    templateUrl: './customersales.component.html',
    styleUrls: ['./customersales.component.scss']
})

export class CustomersalesComponent implements OnInit {
    TodaySolddata: any;
    Salereport:FormGroup;
    ProductSearch :FormGroup;
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
    loguser:any;
    id:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService, private excelService:ExcelService ){}
    ngOnInit() {
        this.d =new Date();
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.id = this.route.snapshot.paramMap.get('id');
        this.getcustomersales();
        this.ProductSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }

    getcustomersales() {
        this.appservice.getcustomerreport(this.startpagevalue,10,this.loguser)
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
        //console.log(this.ProductSearch);
        this.loaderservice.display(true);
        this.appservice.salesearch(this.ProductSearch.value,this.loguser)
        .subscribe(
            data => {
                console.log(data);
                if (data.status == '1') {
                    this.TodaySolddata = data.data;
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
        this.appservice.getcustomerreport(this.pno,10,this.loguser)
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
        this.appservice.getcustomerreport(this.startpagevalue,this.totalrecord.value,this.loguser)
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
        this.router.navigate(['/dupviewinvoice', id]);
    }  
}
