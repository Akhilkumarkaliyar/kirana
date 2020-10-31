import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-meta',
    templateUrl: './create-meta.component.html',
    styleUrls: ['./create-meta.component.scss']
})

export class CreateMetaComponent implements OnInit{
    showbutton: boolean;
    id: any;
    MetaForm: FormGroup;
    showErrorMsg: string;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck") && !this.cookieservice.get("loginsuperuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getcontact();
            this.showbutton = true;
            console.log(this.id);
            this.MetaForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                title: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required]),
            });
        }
    }
    getcontact(){
        this.appservice.MetaDataid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                    if(data.status=='1')
                    {
                        this.showErrorMsg = "";
                        this.MetaForm = new FormGroup({
                            name: new FormControl(data.data[0].name, [Validators.required]),
                            title: new FormControl(data.data[0].title, [Validators.required]),
                            description: new FormControl(data.data[0].description, [Validators.required]),
                         });
                    }else{
                        this.showbutton = false;
                    }
                }
            );
    }
    createmetadata(){
        if(this.MetaForm.invalid){
            return;
        }    
        if(this.MetaForm.valid){
            this.loaderservice.display(true);
            this.appservice.addMetadata(this.MetaForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/meta']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/meta']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editmetadata(){
        if(this.MetaForm.invalid){
            return;
        }    
        if(this.MetaForm.valid){
            this.loaderservice.display(true);
            this.appservice.editmetadata(this.MetaForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/meta']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/meta']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/meta']);
    }

}