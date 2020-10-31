import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-wholesaler',
    templateUrl: './create-wholesaler.component.html',
    styleUrls: ['./create-wholesaler.component.scss']
})

export class CreateWholesalerComponent implements OnInit{
    showbutton: boolean;
    id: any;
    wholesalerForm: FormGroup;
    showErrorMsg: string;
    loguser:any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck") ){
            this.router.navigate(['/auth']);
        }
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getUsers();
            this.showbutton = true;
            this.wholesalerForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                email: new FormControl("", [Validators.required]),
                mobile: new FormControl("", [Validators.required]),
                gstno: new FormControl("", [Validators.required]),
                address: new FormControl("", [Validators.required]),
                status: new FormControl("", [Validators.required]),
            });
        }
    }
    getUsers(){
        this.appservice.WholesalerDetail(this.id,this.loguser)
            .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.wholesalerForm = new FormGroup({
                        name: new FormControl(data.data[0].name, [Validators.required]),
                        email: new FormControl(data.data[0].email, [Validators.required]),
                        mobile: new FormControl(data.data[0].mobile, [Validators.required]),
                        address: new FormControl(data.data[0].address, [Validators.required]),
                        gstno: new FormControl(data.data[0].gstno, [Validators.required]),
                        status: new FormControl(data.data[0].status, [Validators.required]),
                    });
                      
                  }else{
                      this.showbutton = false;
                  }
              }
          );
    }
    createwholesaler(image){
        if(this.wholesalerForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.wholesalerForm.valid){
            this.loaderservice.display(true);
            this.appservice.addwholesaler( this.wholesalerForm.value,this.loguser)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/wholesaler']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/wholesaler']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editwholesaler(){
        if(this.wholesalerForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.wholesalerForm.valid){
            this.loaderservice.display(true);
            this.appservice.editwholesaler(this.wholesalerForm.value,this.id,this.loguser)
            .subscribe(
                data=>{
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/wholesaler']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/wholesaler']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/wholesaler']);
    }
    keyPress(event: any) {
       const pattern = /[0-9\+\-\ ]/;
    
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
    }
}


