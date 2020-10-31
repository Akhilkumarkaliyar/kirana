import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-blog',
    templateUrl: './create-blog.component.html',
    styleUrls: ['./create-blog.component.scss']
})

export class CreateBlogComponent implements OnInit{
    showbutton: boolean;
    id: any;
    BlogForm: FormGroup;
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
            this.getblogdata();
            this.showbutton = true;
            console.log(this.id);
            this.BlogForm = new FormGroup({
                title: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required]),
            });
        }
    }
    getblogdata(){
        this.appservice.BlogDataid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.descen=data.data[0];
                      this.BlogForm = new FormGroup({
                        title: new FormControl(data.data[0].title, [Validators.required]),
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
    createblogdata(image){
        if(this.BlogForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.BlogForm.valid){
            console.log(this.BlogForm);
            this.loaderservice.display(true);
            this.appservice.addBlogdata( this.BlogForm.value, this.fileName)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/blog']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/blog']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editblogdata(){
        if(this.BlogForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.BlogForm.valid){
            this.loaderservice.display(true);
            this.appservice.editblogdata(this.BlogForm.value,this.id,this.fileName)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/blog']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/blog']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/blog']);
    }

}


