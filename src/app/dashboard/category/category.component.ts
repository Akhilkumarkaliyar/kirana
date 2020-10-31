import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
//import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    //providers: [NgbPaginationConfig] 
})

export class CategoryComponent implements OnInit {
    categorydata: any;
    //currentPage2 :any;
    pno:any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService, private excelService:ExcelService  ){}
    //config.boundaryLinks = true
    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck")) {
            this.router.navigate(['/auth']);
        }
        this.getcategory();
    }

    getcategory() {
        this.appservice.category(this.startpagevalue,10)
            .subscribe(
                data => {
                    if (data.status == '1') {
                       // this.currentPage2=data.count;
                        this.categorydata = data.data;
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }
                }
            );
    }
    deletecategory(id){
        this.appservice.deletecategory(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.categorydata = data.data;
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/category']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/category']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }
    goToCreatecategory(id) {
        // alert();
        this.router.navigate(['/create-category', id]);
    }
    goToaddcategory(id) {
        // alert();
        this.router.navigate(['/create-category', id]);
    }
    handleChange(en){
        this.pno=en-1;
         this.appservice.category(this.pno,10)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.categorydata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =en;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.categorydata, 'sample');
     }
     getrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.appservice.category(this.startpagevalue,this.totalrecord.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.categorydata = data.data;
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
