import { Component, OnInit, Input } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) { }
}
@Component({
    selector: 'app-vendor-bill',
    templateUrl: './create-vendor-bill.component.html',
    styleUrls: ['./create-vendor-bill.component.scss']
})

export class CreateVendorBillComponent implements OnInit{
    showbutton: boolean;
    id: any;
    VendorbillForm: FormGroup;
    showErrorMsg: string;
    vendordata : any;
    descen: any;
    loguser :any;
    bill_date:any;
    billdate:any;
    //baseurl : any;
    //startpagevalue:0;
    searchproduct:any;
    mrp:any;
    batchno:any;
    quantity:any;
    exdate:any;
    productdata:any;
    Vendorbillsearch :FormGroup;
    productid:any;
    expiredate:any;
    billdata:any;
    purchaseprice:any;
    amount:any;
    searchvalue:any;
    reasons:any;
    billid:any;
   constructor(private modalService: NgbModal, private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getvendorbill();
            this.getvendor();
            this.showbutton = true;
            this.billdate=new Date();
            this.VendorbillForm = new FormGroup({
                vendor_id: new FormControl("", [Validators.required]),
                bill_no: new FormControl("", [Validators.required]),
                //bill_date: new FormControl(""),
                //amount: new FormControl("", [Validators.required]),
            });
            this.Vendorbillsearch = new FormGroup({
                search: new FormControl("", [Validators.required]),
            });
        }
    }
    getvendor(){
        this.appservice.wholesaler(this.loguser,0)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.vendordata = data.data;
                }
            }
        );
    }
    getvendorbill(){
        this.appservice.vendorbillDetail(this.id,this.loguser)
            .subscribe(
              data=>{
                    if(data.status=='1')
                    {
                      this.showErrorMsg = "";
                      this.billdate =data.data[0].bill_date;
                      this.VendorbillForm = new FormGroup({
                        vendor_id: new FormControl(data.data[0].vendor_id, [Validators.required]),
                        bill_no: new FormControl(data.data[0].bill_no, [Validators.required]),
                        //bill_date: new FormControl(data.data[0].bill_date),
                        //amount: new FormControl(data.data[0].amount, [Validators.required]),
                    });
                      
                  }else{
                      this.showbutton = false;
                  }
              }
          );
    }
    createvendorbill(){
        if(this.VendorbillForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.VendorbillForm.valid){
            this.loaderservice.display(true);
            this.amount=document.getElementById("amount");
            this.appservice.addvendorbill(this.VendorbillForm.value,this.amount.value,this.loguser)
            .subscribe(
                data=>{
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/vendorbill']); 
                        this.billid=data.lastinsertid;               
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/vendorbill']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
            //console.log(this.UserForm.value);
        }
    }
    editvendorbill(){
        if(this.VendorbillForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.VendorbillForm.valid){
            this.loaderservice.display(true);
            this.bill_date=document.getElementById("bill_date");
            this.appservice.editvendorbill(this.VendorbillForm.value,this.id,this.loguser,this.bill_date.value)
            .subscribe(
                data=>{
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/vendorbill']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/vendorbill']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.appservice.emptyvendorbill(this.loguser)
        .subscribe(
            data=>{
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/vendorbill']);                
                }else{
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/vendorbill']);  
                }
            }
        );
    }
    closeResult: string;


    // Open default modal
    open(content,productname) {
        this.searchvalue="";
        this.addvendorproduct(productname);
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    // This function is used in open
    private getDismissReason(reason: any): string {
        this.searchvalue="";
        console.log('xsxs'+this.searchvalue);
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
        this.searchvalue="";
        this.modalService.open(customContent, { windowClass: 'dark-modal' });
    }

    // Open content with dark section
    openContent() {
        this.searchvalue="";
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
    addvendorproduct(productname){
        this.loaderservice.display(true);
        this.appservice.addvendorproduct(this.loguser,productname)
        .subscribe(
            data => {
                //console.log(data);
                if (data.status == '1') {
                    console.log(data.data);
                    this.toasterservice.Success(data.message);
                    this.productid=data.data.id;
                    this.purchaseprice=data.data.available_price;
                    this.mrp=data.data.mrp;
                    this.quantity=data.data.quantity;
                    this.exdate=data.data.expire_date;
                    this.batchno=data.data.batch_no;
                    this.searchvalue="";
                }else if(data.status == '2'){ 
                    this.toasterservice.Error(data.message);
                }
            }
        );
    }
    createvendorproduct(){
        this.loaderservice.display(true);
        this.productid=document.getElementById("productid");
        this.purchaseprice=document.getElementById("purchaseprice");
        this.mrp=document.getElementById("mrp");
        this.quantity=document.getElementById("quantity");
        this.expiredate=document.getElementById("expiredate");
        this.batchno=document.getElementById("batchno");
        this.appservice.createvendorproduct( this.loguser,this.productid.value,this.purchaseprice.value,this.mrp.value,this.quantity.value,this.expiredate.value,this.batchno.value)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);
                    this.productid='';
                    this.purchaseprice='';
                    this.mrp='';
                    this.quantity='';
                    this.exdate='';
                    this.batchno='';
                    this.billdata=data.data;
                    this.amount=data.amount;
                    this.searchvalue="";
                    this.reasons='Cross click';
                    this.closeResult = `Dismissed ${this.getDismissReason(this.reasons)}`;

                }else{
                    this.toasterservice.Error(data.message);
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
}


