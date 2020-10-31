import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) { }
}

@Component({
    selector: 'app-vendorbill',
    templateUrl: './vendorbill.component.html',
    styleUrls: ['./vendorbill.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class VendorbillComponent implements OnInit {
    vendorbill: any;
    Vendorbillsearch :any;
    loguser:any;
    excelbaseurl:any;
    startValue: any;
    endValue:any;
    startDateValue:any;
    endDateValue:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    pno:any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    categorydata : any;
    subcategorydata :any;
    exdate:any;
    hsndata:any;
    gst:any;
    gstvalue:any;
    barcode:any;
    name:any;
    catid:any;
    subcatid:any;
    mrp:any;
    sellingprice:any;
    chemicalname:any;
    companyname:any;
    expiredate:any;
    quantity:any;
    rackno:any;
    batchno:any;
    isprescription:any;
    hsncode:any;
    perquantity:any;
    gstdata:any;
    billdata:any;
    billid:any;
    searchproduct:any;
    productdata:any;
    form:any;
    cat_id:any;
    subcat_id:any;
    hsn_code:any;
    productid:any;
    catname:any;
    subcatname:any;
    hsnname:any;
    purchaseprice:any;
    constructor(private modalService: NgbModal, private appservice: AppService, private route: Router, private cookieservice: CookieService, private toasterservice: ToasterService, private loaderservice: LoaderService, private excelService:ExcelService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck") ) {
            this.route.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getvendorbill();
        this.Vendorbillsearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }

    getvendorbill() {
        this.appservice.vendorbill(this.loguser,this.startpagevalue,10)
            .subscribe(
                data => {
                    if (data.status == '1') {
                       this.vendorbill = data.data;
                       //this.excelbaseurl=sessionStorage.getItem("excelurl");
                       this.totalRecords = data.record;
                       this.itemsPerPage =10;
                       this.currentPage =this.initialPageValue;
                    }else{
                       this.vendorbill ='';
                       this.totalRecords = '';
                    }
                }
            );
    }
    getbill(){
        this.loaderservice.display(true);
        this.appservice.Vendorbillsearch(this.Vendorbillsearch.value,this.loguser)
        .subscribe(
            data => {
                //console.log(data);return;
                if (data.status == '1') {
                    this.vendorbill = data.data; 
                }else if(data.status == '2'){ 
                    this.vendorbill =data.data;
                }
            }
        );
    } 
    goToCreatevendorbill(id) {
        // alert();
        this.route.navigate(['/create-vendorbill', id]);
    }
    goToaddvendorbill(id) {
        // alert();
        this.route.navigate(['/create-vendorbill', id]);
    }
    handleChange(en){
        this.pno=en-1;
         this.appservice.vendorbill(this.loguser,this.startpagevalue,10)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.vendorbill = data.data;
                   // this.excelbaseurl=sessionStorage.getItem("excelurl");
                    this.totalRecords = data.record;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.vendorbill, 'sample');
     }
     getrecord(){
        this.totalrecord=document.getElementById("getpage");
        this.appservice.vendorbill(this.loguser,this.startpagevalue,this.totalrecord.value)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.vendorbill = data.data;
                    if(this.totalrecord.value == 10){
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }else{
                        this.totalRecords = '';
                    }
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
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
    getsubcategory(cat_id){
        this.appservice.SubCategorycatDetail(cat_id)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.subcategorydata = data.data;
                }
            }
        );
    }
    gethsn(){
        this.appservice.hsn()
        .subscribe(
            data=>{
                if(data.status=='1'){
                    console.log(data);
                    this.hsndata = data.data;
                }
            }
        );
    }
    
    getgst(hsn){
        this.appservice.getgst(hsn)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.gstdata = data.data;
                }
            }
        );
    }
    getbillproduct(billid){
        //console.log(billid);
        this.appservice.getbillproduct(this.loguser,billid)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.billdata = data.data;
                }
            }
        );
    }
    deleteproduct(productid,billid){
        console.log(productid);
        this.appservice.deleteproduct(this.loguser,productid,billid)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.toasterservice.Success(data.message);
                    this.billdata = data.data;
                }else{
                    this.toasterservice.Error(data.message);
                    this.billdata = data.data;
                }
            }
        );
    }
    closeResult: string;


    // Open default modal
    open(content,billid) {
        this.getcategory();
        this.exdate=new Date();
        this.gethsn();
        this.billid=billid;
        this.mrp="";
        this.quantity="";
        this.expiredate=new Date();;
        this.rackno="";
        this.batchno="";
        
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    exit(exitproduct,billid) {
        console.log(billid);
        this.getbillproduct(billid);
        this.billid=billid;
        this.form = 1;
        this.modalService.open(exitproduct).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    view(contents,billid) {
        this.getbillproduct(billid);
        this.billid=billid;
        this.modalService.open(contents).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    
    updateproduct(){
        this.loaderservice.display(true);
        this.productid=document.getElementById("productid");
        this.billid=document.getElementById("billid");
        this.mrp=document.getElementById("mrp");
        this.quantity=document.getElementById("quantity");
        this.expiredate=document.getElementById("expiredate");
        this.batchno=document.getElementById("batch_no");
        this.purchaseprice=document.getElementById("purchaseprice");
        this.appservice.updatebillproduct( this.loguser,this.productid.value,this.billid.value,this.mrp.value,this.quantity.value,this.expiredate.value,this.batchno.value,this.purchaseprice.value)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);
                    this.form = 3;  
                    this.billdata = data.data; 
                    this.getvendorbill();           
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.form = 2; 
                    this.getvendorbill();
                    //this.route.navigate(['/product']);  
                }else{
                    this.toasterservice.Error(data.message);
                    this.getvendorbill();
                }
            }
        );
    }
    // This function is used in open
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    // Open modal with dark section
    openModal(customContent) {
        this.modalService.open(customContent, { windowClass: 'dark-modal' });
    }

    // Open content with dark section
    openContent() {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = 'World';
    }
    getProduct() {
        this.searchproduct=document.getElementById("searchproduct");
        this.appservice.productlist(this.loguser,this.searchproduct.value)
            .subscribe(
                data => {
                    if (data.status == '1') {
                       this.productdata = data.data;
                    }
                }
            );
    }
    addvendorproduct(){
        this.searchproduct=document.getElementById("searchproduct");
        this.billid=document.getElementById("billid");
        this.loaderservice.display(true);
        this.appservice.addvendorproducts(this.loguser,this.searchproduct.value.trim(),this.billid.value)
        .subscribe(
            data => {
                console.log(data);
                if (data.status == '1') {
                    console.log(data.data);
                    this.toasterservice.Success(data.message);
                    this.form = 2; 
                    this.billid= data.billid;
                    this.productid=data.data.id;
                    //console.log(this.productid);
                    this.mrp=data.data.mrp;
                    this.purchaseprice=data.data.available_price;
                    this.quantity=data.data.quantity;
                    this.exdate=data.data.expire_date;
                    this.batchno=data.data.batch_no;
                    this.getvendorbill();
                   //this.Billingdata = data.data;
                }else if(data.status == '2'){ 
                    this.form = 1;
                    this.toasterservice.Error(data.message);
                }
            }
        );
    }
}
