import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {
    productdata: any;
    ProductSearch :FormGroup;
    loguser:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    pno:any;
    itemsPerPage:any;
    currentPage:any;
    totalrecord:any;
    sortby:any;
    categorydata:any;
    gettype:any;
    myDate:any;
    expiredatesearch:any;
    constructor(private excelService:ExcelService,private appservice: AppService, private route: Router, private cookieservice: CookieService, private toasterservice: ToasterService, private loaderservice: LoaderService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck")) {
            this.route.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getProduct();
        this.getcategory();
        this.ProductSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }

    getProduct() {
        this.sortby=document.getElementById("getsortpage");
        this.gettype=document.getElementById("gettype");
        this.appservice.product(this.loguser,this.startpagevalue,10,this.sortby.value,this.gettype.value)
            .subscribe(
                data => {
                    if (data.status == '1') {
                        this.productdata = data.data;
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                        this.myDate=new Date();
                    }
                }
            );
    }
    getcategory(){
        //console.log(this.loguser);
        this.appservice.category(0,100)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.categorydata = data.data;
                }
            }
        );
    }
    getproductname(){
        //console.log(this.ProductSearch);
        this.loaderservice.display(true);
        this.sortby=document.getElementById("getsortpage");
        this.gettype=document.getElementById("gettype");
        this.appservice.productsearch(this.ProductSearch.value,this.loguser,this.startpagevalue,10,this.sortby.value,this.gettype.value)
        .subscribe(
            data => {
                //console.log(data);return;
                if (data.status == '1') {
                    this.productdata = data.data; 
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }else if(data.status == '2'){ 
                    this.productdata =data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }
            }
        );
    } 
    addbilling(id){
        this.appservice.addbilling(id,1)
        .subscribe(
            data => {
                //console.log(data);return;
                if (data.status == '1') {
                    this.toasterservice.Success(data.message);
                    this.productdata = data.data;   
                    this.route.navigate(['/product']);   
                }else if(data.status == '2'){ 
                    this.toasterservice.Error(data.message);
                    this.productdata = data.data;   
                    this.route.navigate(['/product']);   
                }
            }
        );
    }
    goToCreateProduct(id) {
        // alert();
        this.route.navigate(['/create-product', id]);
    }
    goToaddproduct(id) {
        // alert();
        this.route.navigate(['/create-product', id]);
    }
    handleChange(en){
        this.pno=en-1;
        this.sortby=document.getElementById("getsortpage");
        this.gettype=document.getElementById("gettype");
        this.appservice.product(this.loguser,this.pno,10,this.sortby.value,this.gettype.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.productdata = data.data;
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =en;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.productdata, 'sample');
     }
     getrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.sortby=document.getElementById("getsortpage");
        this.gettype=document.getElementById("gettype");
        this.appservice.product(this.loguser,this.startpagevalue,this.totalrecord.value,this.sortby.value,this.gettype.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.productdata = data.data;
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
        this.gettype=document.getElementById("gettype");
        this.appservice.product(this.loguser,this.startpagevalue,this.totalrecord.value,this.sortby.value,this.gettype.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.productdata = data.data;
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
    gettypedata(){
        this.totalrecord=document.getElementById("getpage");
        this.sortby=document.getElementById("getsortpage");
        this.gettype=document.getElementById("gettype");
        this.appservice.product(this.loguser,this.startpagevalue,this.totalrecord.value,this.sortby.value,this.gettype.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.productdata = data.data;
                    if(this.totalrecord.value == 10){
                        this.totalRecords = data.record;
                    }else{
                        this.totalRecords = '';
                    }
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }else{
                    this.productdata = data.data;
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
    getexpiredata(){
        this.totalrecord=document.getElementById("getpage");
        this.expiredatesearch=document.getElementById("searchexpire");
        this.appservice.productsearchexpire(this.loguser,this.startpagevalue,this.totalrecord.value,this.expiredatesearch.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.productdata = data.data;
                    if(this.totalrecord.value == 10){
                        this.totalRecords = data.record;
                    }else{
                        this.totalRecords = '';
                    }
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }else{
                    this.productdata = data.data;
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
