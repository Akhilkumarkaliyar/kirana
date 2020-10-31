import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-cms',
    templateUrl: './create-cms.component.html',
    styleUrls: ['./create-cms.component.scss']
})

export class CreateCmsComponent implements OnInit{
    showbutton: boolean;
    id: any;
    CmsForm: FormGroup;
    showErrorMsg: string;
    Cmslist: any;
    public editorValue: string = '';
    file: any;
    fileName: any;
    name: any;
    descen: any;
   constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getcmsdata();
            this.getcms();
            this.showbutton = true;
            console.log(this.id);
            this.CmsForm = new FormGroup({
                cms_id: new FormControl("", [Validators.required]),
                name: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required]),
            });
        }
    }
    getcms() {
        this.appservice.cms()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Cmslist = data.data;
                    }
                }
            );
    }
    getcmsnamedata(cms_id){
        this.appservice.cmsnamedata(cms_id)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.showErrorMsg = "";
                    this.descen=data.data[0];
                    this.CmsForm = new FormGroup({
                      cms_id: new FormControl(data.data[0].cms_id, [Validators.required]),
                      name: new FormControl(data.data[0].name, [Validators.required]),
                      description: new FormControl(data.data[0].description, [Validators.required]),
                  });
                    
                }else{

                    this.showbutton = false;
                    this.CmsForm = new FormGroup({
                        cms_id: new FormControl(cms_id, [Validators.required]),
                        name: new FormControl("", [Validators.required]),
                        description: new FormControl("", [Validators.required]),
                    });
                }
            }
        );
    }
    getcmsdata(){
        this.appservice.Cmsid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.descen=data.data[0];
                      this.CmsForm = new FormGroup({
                        cms_id: new FormControl(data.data[0].cms_id, [Validators.required]),
                        name: new FormControl(data.data[0].name, [Validators.required]),
                        description: new FormControl(data.data[0].description, [Validators.required]),
                    });
                      
                  }else{
                      this.showbutton = false;
                  }
              }
          );
    }
    createcms(){
        if(this.CmsForm.invalid){
            return;
        }    
        if(this.CmsForm.valid){
            console.log(this.CmsForm);
            this.loaderservice.display(true);
            this.appservice.addcms( this.CmsForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/cms']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/cms']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editcms(){
        if(this.CmsForm.invalid){
            return;
        }    
        if(this.CmsForm.valid){
            this.loaderservice.display(true);
            this.appservice.editcms(this.CmsForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/cms']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/cms']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/cms']);
    }

}


