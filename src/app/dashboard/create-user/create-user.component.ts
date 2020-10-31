import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute,Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-auth',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent implements OnInit{
    id: any;
    UserForm: FormGroup;
    showErrorMsg: string;
    loginData: any; 
    hospitaldata : any;
    showbutton: boolean = false;
    countrydata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getUsers();
            this.showbutton = true;
            console.log(this.id);
        }
        console.log(this.showbutton);
        //this.getcountry();
        this.UserForm = new FormGroup({
            fname: new FormControl("", [Validators.required]),
            lname: new FormControl("", [Validators.required]),
            hospital: new FormControl("", [Validators.required]),
            country: new FormControl("", [Validators.required]),
            city: new FormControl("", [Validators.required]),
            email: new FormControl("", [Validators.required]),
            mobile: new FormControl("", [Validators.required]),
          });
    }
    getcountry(){
        this.appservice.country()
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.countrydata = data.data;
                }
            }
        );
    }
    getUsers(){
        this.appservice.userDetail(this.id)
        .subscribe(
            data=>{
                if(data.status=='1')
                {
                    this.showErrorMsg = "";
                    this.UserForm = new FormGroup({
                        fname: new FormControl(data.data[0].fname, [Validators.required]),
                        lname: new FormControl(data.data[0].lname, [Validators.required]),
                        hospital: new FormControl(data.data[0].hospital, [Validators.required]),
                        country: new FormControl(data.data[0].country, [Validators.required]),
                        city: new FormControl(data.data[0].city, [Validators.required]),
                        email: new FormControl(data.data[0].email, [Validators.required]),
                        mobile: new FormControl(data.data[0].mobile, [Validators.required]),
                      });
                    
                }else{
                    this.showbutton = false;
                }

                //console.log(data);
            }
        );



}

createuser(){
    if(this.UserForm.invalid){
        this.toasterservice.Error("Please enter the required filed");
        return;
    }    
    if(this.UserForm.valid){
        this.appservice.adduser(this.UserForm.value)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/appuser']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/appuser']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        )
    }
}
edituser(){
    if(this.UserForm.invalid){
        this.toasterservice.Error("Please enter the required filed");
        return;
    }    
    if(this.UserForm.valid){
        this.appservice.edituser(this.UserForm.value,this.id)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/appuser']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/appuser']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        )
    }
}
Gotolist(){
    this.router.navigate(['/appuser']);
}


}


