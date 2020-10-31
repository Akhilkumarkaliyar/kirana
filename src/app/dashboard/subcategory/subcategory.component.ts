import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-subcategory',
    templateUrl: './subcategory.component.html',
    styleUrls: ['./subcategory.component.scss']
})

export class SubCategoryComponent implements OnInit {
    subcategorydata: any;
    pno:any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    constructor(private appservice: AppService, private route: Router, private cookieservice: CookieService, private excelService:ExcelService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck")) {
            this.route.navigate(['/auth']);
        }
        this.getsubcategory();
    }

    getsubcategory() {
        this.appservice.subcategory(this.startpagevalue,10)
            .subscribe(
                data => {
                    if (data.status == '1') {
                        this.subcategorydata = data.data;
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }
                }
            );
    }
    goToCreatesubcategory(id) {
        // alert();
        this.route.navigate(['/create-subcategory', id]);
    }
    goToaddsubcategory(id) {
        // alert();
        this.route.navigate(['/create-subcategory', id]);
    }
    handleChange(en){
        this.pno=en-1;
         this.appservice.subcategory(this.pno,10)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.subcategorydata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =en;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.subcategorydata, 'sample');
    }
    getrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.appservice.subcategory(this.startpagevalue,this.totalrecord.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.subcategorydata = data.data;
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
