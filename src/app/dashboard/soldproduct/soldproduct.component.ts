import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';
@Component({
    selector: 'app-soldproduct',
    templateUrl: './soldproduct.component.html',
    styleUrls: ['./soldproduct.component.scss']
})

export class SoldproductComponent implements OnInit {
    Soldproductdata: any;
    SaleproductSearch:any;
    loguser:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    pno:any;
    itemsPerPage :any;
    currentPage :any;
    constructor(private excelService:ExcelService,private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getSoldproductdata();
        this.SaleproductSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }

    getSoldproductdata() {
        this.appservice.soldproductdata(this.loguser,this.startpagevalue)
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Soldproductdata = data.data;
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }
                }
            );
    }
    getsalesearch(){

    }
    deleteReviewdatadata(id){
        this.appservice.deletereview(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/addtocart']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/addtocart']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }
    handleChange(en){
        this.pno=en-1;
        this.appservice.soldproductdata(this.loguser,this.pno)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.Soldproductdata = data.data;
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
        this.excelService.exportAsExcelFile(this.Soldproductdata, 'sample');
     }

}
