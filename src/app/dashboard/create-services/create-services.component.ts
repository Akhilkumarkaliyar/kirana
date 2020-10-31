import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { getBootstrapListener } from '@angular/router/src/router_module';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-services',
    templateUrl: './create-services.component.html',
    styleUrls: ['./create-services.component.scss']
})

export class CreateServicesComponent implements OnInit{
    id: string;
    showbutton: boolean;
    ServicesForm: FormGroup;
    showErrorMsg: string;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}

    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck") && !this.cookieservice.get("loginsuperuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getcategory();
            this.showbutton = true;
            console.log(this.id);
            this.ServicesForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                chemical_name: new FormControl("", [Validators.required]),
                mrp: new FormControl("", [Validators.required]),
                selling_price: new FormControl("", [Validators.required]),
                company_name: new FormControl("", [Validators.required]),
                quantity: new FormControl("", [Validators.required]),
                expire_date: new FormControl("", [Validators.required]),
                available_date: new FormControl("", [Validators.required])
            });
        }
    }
    getcategory(){
      this.appservice.ServicesDetail(this.id)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.showErrorMsg = "";
                    this.ServicesForm = new FormGroup({
                        name: new FormControl(data.data[0].name, [Validators.required]),
                        chemical_name: new FormControl(data.data[0].chemical_name, [Validators.required]),
                        mrp: new FormControl(data.data[0].mrp, [Validators.required]),
                        selling_price: new FormControl(data.data[0].selling_price, [Validators.required]),
                        company_name: new FormControl(data.data[0].company_name, [Validators.required]),
                        quantity: new FormControl(data.data[0].quantity, [Validators.required]),
                        expire_date: new FormControl(data.data[0].expire_date, [Validators.required]),
                        available_date: new FormControl(data.data[0].available_date, [Validators.required]),
                    });
                    
                }else{
                    this.showbutton = false;
                }
            }
        );
    }
    createcategory(){
        if(this.ServicesForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.ServicesForm.valid){
            this.loaderservice.display(true);
            this.appservice.addservices(this.ServicesForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/services']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/services']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editcategory(){
        if(this.ServicesForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.ServicesForm.valid){
            this.loaderservice.display(true);
            this.appservice.editservices(this.ServicesForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/services']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/services']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/services']);
    }
}


