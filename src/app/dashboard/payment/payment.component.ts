import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import {ExcelService} from '../../shared/services/excel.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) { }
}

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {
    vendorpayment: any;
    VendorpayementSearch :any;
    loguser:any;
    excelbaseurl:any;
    totalRecords: any;
    initialPageValue = 1;
    startpagevalue = 0;
    pno:any;
    totalrecord:any
    itemsPerPage:any;
    currentPage:any;
    amount:any;
    allbill:any;
    VendorpaymentForm:FormGroup;
    paidamount:any;
    pendingamount:any;
    vendorid:any;
    vendor_id:any;
    constructor(private modalService: NgbModal,private appservice: AppService, private route: Router, private cookieservice: CookieService, private toasterservice: ToasterService, private loaderservice: LoaderService, private excelService:ExcelService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck") ) {
            this.route.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.getvendorpayment();
        this.VendorpayementSearch = new FormGroup({
            search: new FormControl("", [Validators.required]),
        });
    }
    getvendorpayment() {
        this.appservice.vendorpayment(this.loguser,this.startpagevalue)
            .subscribe(
                data => {
                    if (data.status == '1') {
                        this.vendorpayment = data.data;
                        this.totalRecords = data.record;
                        this.itemsPerPage =10;
                        this.currentPage =this.initialPageValue;
                    }else{
                        this.vendorpayment ='';
                        this.totalRecords = '';
                     }
                }
            );
    }
    getvendorpaymentname(){
        this.loaderservice.display(true);
        this.appservice.vendorpaymentsearch(this.VendorpayementSearch.value,this.loguser)
        .subscribe(
            data => {
                //console.log(data);return;
                if (data.status == '1') {
                    this.vendorpayment = data.data; 
                }else if(data.status == '2'){ 
                    this.vendorpayment =data.data;
                }
            }
        );
    } 
    goToCreatevendorpayment(id) {
        // alert();
        this.route.navigate(['/create-vendorpayment', id]);
    }
    goToaddvendorpayment(id) {
        // alert();
        this.route.navigate(['/create-vendorpayment', id]);
    }
    handleChange(en){
        this.pno=en-1;
        this.appservice.vendorpayment(this.loguser,this.pno)
        .subscribe(
            data => {
                if(data.status=='1'){
                    this.vendorpayment = data.data;
                   // this.excelbaseurl=sessionStorage.getItem("excelurl");
                    this.totalRecords = data.record;
                    this.itemsPerPage =10;
                    this.currentPage =this.initialPageValue;
                }
            }
        );
    }

    exportAsXLSX():void {
        console.log("excel download");
        this.excelService.exportAsExcelFile(this.vendorpayment, 'sample');
     }
     closeResult: string;


    // Open default modal
    exit(exitproduct,amount,vendorid) {
        this.amount=amount;
        this.vendorid=vendorid;
        this.getvendorbill(vendorid);
        this.VendorpaymentForm = new FormGroup({
            bill_id: new FormControl("", [Validators.required]),
            mode: new FormControl("", [Validators.required]),
        });
        this.modalService.open(exitproduct).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    history(billhistory,vendorid) {
        this.vendorid=vendorid;
        this.getallvendorbill(vendorid);
        this.modalService.open(billhistory).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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
    getvendorbill(vendorid){
        console.log(vendorid);
        this.appservice.nonpaidvendorbill(this.loguser,vendorid)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.allbill = data.data;
                }
            }
        );
    }
    getallvendorbill(vendorid){
        this.appservice.allvendorbill(this.loguser,vendorid)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.allbill = data.data;
                }
            }
        );
    }
    createvendorpayment(){
        if(this.VendorpaymentForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.VendorpaymentForm.valid){
            this.loaderservice.display(true);
            this.paidamount=document.getElementById("paidamount");
            this.pendingamount=document.getElementById("pendingamount");
            this.vendor_id=document.getElementById("vendorid");
            this.appservice.addvendorpayment(this.VendorpaymentForm.value,this.loguser,this.paidamount.value,this.pendingamount.value,this.vendor_id.value)
            .subscribe(
                data=>{
                    if(data.status=='1')
                    {
                        this.getvendorpayment();
                        this.toasterservice.Success(data.message);   
                        this.route.navigate(['/payment']);                
                    }else if(data.status=='2'){
                        this.getvendorpayment();
                        this.toasterservice.Error(data.message);
                        this.route.navigate(['/payment']);  
                    }else{
                        this.getvendorpayment();
                        this.toasterservice.Error(data.message);
                    }
                }
            );
            //console.log(this.UserForm.value);
        }
    }
}
