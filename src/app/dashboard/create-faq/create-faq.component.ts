import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-faq',
    templateUrl: './create-faq.component.html',
    styleUrls: ['./create-faq.component.scss']
})

export class CreateFaqComponent implements OnInit{
    showbutton: boolean;
    id: any;
    FaqForm: FormGroup;
    showErrorMsg: string;
    Sluglist: any;
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
            this.getfaqdata();
            this.showbutton = true;
            console.log(this.id);
            this.FaqForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required]),
            });
        }
    }
    getfaqdata(){
        this.appservice.FaqDataid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.descen=data.data[0];
                      this.FaqForm = new FormGroup({
                        name: new FormControl(data.data[0].name, [Validators.required]),
                        description: new FormControl(data.data[0].description, [Validators.required]),
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
    createfaqdata(image){
        if(this.FaqForm.invalid){
            return;
        }    
        if(this.FaqForm.valid){
            console.log(this.FaqForm);
            this.loaderservice.display(true);
            this.appservice.addFaqdata( this.FaqForm.value, this.fileName)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/faq']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/faq']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editfaqdata(){
        if(this.FaqForm.invalid){
            return;
        }    
        if(this.FaqForm.valid){
            this.loaderservice.display(true);
            this.appservice.editfaqdata(this.FaqForm.value,this.id,this.fileName)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/faq']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/faq']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/faq']);
    }

}


