import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-contact',
    templateUrl: './create-contact.component.html',
    styleUrls: ['./create-contact.component.scss']
})

export class CreateContactComponent implements OnInit{
    showbutton: boolean;
    id: any;
    ContactForm: FormGroup;
    showErrorMsg: string;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getcontact();
            this.showbutton = true;
            console.log(this.id);
            this.ContactForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                email: new FormControl("", [Validators.required]),
                mobile: new FormControl("", [Validators.required]),
                fax: new FormControl("", [Validators.required]),
                license_no: new FormControl("", [Validators.required]),
                expire_date: new FormControl("", [Validators.required]),
                address: new FormControl("", [Validators.required])
            });
        }
    }
    getcontact(){
        this.appservice.ContactDetail(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                    if(data.status=='1')
                    {
                        this.showErrorMsg = "";
                        this.ContactForm = new FormGroup({
                            name: new FormControl(data.data[0].name, [Validators.required]),
                            email: new FormControl(data.data[0].email, [Validators.required]),
                            mobile: new FormControl(data.data[0].mobile, [Validators.required]),
                            fax: new FormControl(data.data[0].fax, [Validators.required]),
                            license_no: new FormControl(data.data[0].license_no, [Validators.required]),
                            expire_date: new FormControl(data.data[0].expire_date, [Validators.required]),
                            address: new FormControl(data.data[0].address, [Validators.required]),
                        });
                    }else{
                        this.showbutton = false;
                    }
                }
            );
    }
    createcontact(){
        if(this.ContactForm.invalid){
            return;
        }    
        if(this.ContactForm.valid){
            this.loaderservice.display(true);
            this.appservice.addcontact(this.ContactForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/contact']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/contact']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editcontact(){
        if(this.ContactForm.invalid){
            return;
        }    
        if(this.ContactForm.valid){
            this.loaderservice.display(true);
            this.appservice.editcontact(this.ContactForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/contact']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/contact']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/contact']);
    }

}


