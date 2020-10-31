import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-testimonial',
    templateUrl: './create-testimonial.component.html',
    styleUrls: ['./create-testimonial.component.scss']
})

export class CreateTestimonialComponent implements OnInit{
    showbutton: boolean;
    id: any;
    TestimonialForm: FormGroup;
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
            this.gettestimonialdata();
            this.showbutton = true;
            console.log(this.id);
            this.TestimonialForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required]),
            });
        }
    }
    gettestimonialdata(){
        this.appservice.TestimonialDataid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.descen=data.data[0];
                      this.TestimonialForm = new FormGroup({
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
    createtestimonialdata(image){
        if(this.TestimonialForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.TestimonialForm.valid){
            console.log(this.TestimonialForm);
            this.loaderservice.display(true);
            this.appservice.addTestimonialdata( this.TestimonialForm.value, this.fileName)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/testimonial']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/testimonial']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    edittestimonialdata(){
        if(this.TestimonialForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.TestimonialForm.valid){
            this.loaderservice.display(true);
            this.appservice.edittestimonialdata(this.TestimonialForm.value,this.id,this.fileName)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/testimonial']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/testimonial']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/testimonial']);
    }

}


