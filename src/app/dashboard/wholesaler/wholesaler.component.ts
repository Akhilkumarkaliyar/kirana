import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-wholesaler',
    templateUrl: './wholesaler.component.html',
    styleUrls: ['./wholesaler.component.scss']
})

export class WholesalerComponent implements OnInit {
    wholesaler: any;
    WholesalerSearch :any;
    loguser:any;
    excelbaseurl:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    pno:any;
    itemsPerPage:any;
    currentPage:any;
    constructor(private excelService:ExcelService,private appservice: AppService, private route: Router, private cookieservice: CookieService, private toasterservice: ToasterService, private loaderservice: LoaderService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck") ) {
            this.route.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getwholesaler();
        this.WholesalerSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }

    getwholesaler() {
        this.appservice.wholesaler(this.loguser,this.startpagevalue)
            .subscribe(
                data => {
                    //console.log(data);return;
                    if (data.status == '1') {
                        this.wholesaler = data.data;
                        //this.excelbaseurl=sessionStorage.getItem("excelurl");
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }
                }
            );
    }
    getwholesalername(){
        this.loaderservice.display(true);
        this.appservice.wholesalersearch(this.WholesalerSearch.value,this.loguser)
        .subscribe(
            data => {
                //console.log(data);return;
                if (data.status == '1') {
                    this.wholesaler = data.data; 
                }else if(data.status == '2'){ 
                    this.wholesaler =data.data;
                }
            }
        );
    } 
    goToCreatewholesaler(id) {
        // alert();
        this.route.navigate(['/create-wholesaler', id]);
    }
    goToaddwholesaler(id) {
        // alert();
        this.route.navigate(['/create-wholesaler', id]);
    }
    handleChange(en){
        this.pno=en-1;
        this.appservice.wholesaler(this.loguser,this.pno)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.wholesaler = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.wholesaler, 'sample');
     }
}
