import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { getBootstrapListener } from '@angular/router/src/router_module';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-carrier',
    templateUrl: './create-carrier.component.html',
    styleUrls: ['./create-carrier.component.scss']
})

export class CreateCarrierComponent implements OnInit{
    id: string;
    showbutton: boolean;
    CarrierForm: FormGroup;
    showErrorMsg: string;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}

    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getcarrier();
            this.showbutton = true;
            console.log(this.id);
            this.CarrierForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                last_date: new FormControl("", [Validators.required]),
             });
        }
    }
    getcarrier(){
      this.appservice.CarrierDetail(this.id)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.showErrorMsg = "";
                    this.CarrierForm = new FormGroup({
                        name: new FormControl(data.data[0].name, [Validators.required]),
                        last_date: new FormControl(data.data[0].last_date, [Validators.required]),
                    });
                    
                }else{
                    this.showbutton = false;
                }
            }
        );
    }
    createcarrierForm(){
        if(this.CarrierForm.invalid){
            return;
        }    
        if(this.CarrierForm.valid){
            this.loaderservice.display(true);
            this.appservice.addcarrier(this.CarrierForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/carrier']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/carrier']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editcarrierForm(){
        if(this.CarrierForm.invalid){
            return;
        }    
        if(this.CarrierForm.valid){
            this.loaderservice.display(true);
            this.appservice.editcarrier(this.CarrierForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/carrier']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/carrier']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/carrier']);
    }
}


