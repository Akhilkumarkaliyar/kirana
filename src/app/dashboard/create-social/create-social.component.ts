import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-social',
    templateUrl: './create-social.component.html',
    styleUrls: ['./create-social.component.scss']
})

export class CreateSocialComponent implements OnInit{
    showbutton: boolean;
    id: any;
    SocialForm: FormGroup;
    showErrorMsg: string;
    Sluglist: any;
    public editorValue: string = '';
    file: any;
    fileName: any;
    name: any;
    descen: any;
   constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}
    
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck") && !this.cookieservice.get("loginsuperuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getsocialdata();
            this.showbutton = true;
            console.log(this.id);
            this.SocialForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                link: new FormControl("", [Validators.required]),
            });
        }
    }
    getsocialdata(){
        this.appservice.SocialDataid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.descen=data.data[0];
                      this.SocialForm = new FormGroup({
                        name: new FormControl(data.data[0].name, [Validators.required]),
                        link: new FormControl(data.data[0].link, [Validators.required]),
                        image: new FormControl(data.data[0].image, [Validators.required]),
                      });
                      
                  }else{
                      this.showbutton = false;
                  }
              }
          );
    }

    filechange(e){
        this.file = e.target.files[0];
        console.log(this.file);
        this.fileName = e.target.files[0];
        this.name = e.target.files[0].name;
    }
    createsocialdata(image){
        if(this.SocialForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.SocialForm.valid){
            console.log(this.SocialForm);
            this.loaderservice.display(true);
            this.appservice.addSocialdata( this.SocialForm.value, this.fileName)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/social']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/social']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editsocialdata(){
        if(this.SocialForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.SocialForm.valid){
            this.loaderservice.display(true);
            this.appservice.editsocialdata(this.SocialForm.value,this.id,this.fileName)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/social']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/social']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/social']);
    }

}


