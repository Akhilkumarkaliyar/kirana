import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-comingproduct',
    templateUrl: './comingproduct.component.html',
    styleUrls: ['./comingproduct.component.scss']
})

export class ComingproductComponent implements OnInit {
    comingproductdata: any;
    ProductSearch :FormGroup;
    id:any;
    loguser:any;
    startpagevalue:any;
    pno:any;
    itemsPerPage:any;
    currentPage:any;
    totalrecord:any;
    totalRecords: any;
    initialPageValue = 1;
    sortby:any;
    constructor(private excelService:ExcelService,private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getstockproductdata();
        this.ProductSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }
    getstockproductdata() {
        this.sortby=document.getElementById("getsortpage");
        this.appservice.stockproductdata(this.loguser,0,10,this.sortby.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.comingproductdata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }else{
                    this.comingproductdata = '';
                    this.totalRecords = '';
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }
            }
        );
    }
    getproductname(){
        //console.log(this.ProductSearch);
        this.loaderservice.display(true);
        this.appservice.stocksearch(this.ProductSearch.value,this.loguser)
        .subscribe(
            data => {
                if (data.status == '1') {
                    this.comingproductdata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }else if(data.status == '2'){ 
                    this.comingproductdata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }
            }
        );
    } 
    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.comingproductdata, 'sample');
     }
     getrecord(){

        this.totalrecord=document.getElementById("getpage");
        this.sortby=document.getElementById("getsortpage");
        this.appservice.stockproductdata(this.loguser,this.startpagevalue,this.totalrecord.value,this.sortby.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.comingproductdata = data.data;
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
    getsortrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.sortby=document.getElementById("getsortpage");
        this.appservice.stockproductdata(this.loguser,this.startpagevalue,this.totalrecord.value,this.sortby.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.comingproductdata = data.data;
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
