import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { getBootstrapListener } from '@angular/router/src/router_module';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-category',
    templateUrl: './create-category.component.html',
    styleUrls: ['./create-category.component.scss']
})

export class CreateCategoryComponent implements OnInit{
    id: string;
    showbutton: boolean;
    CategoryForm: FormGroup;
    showErrorMsg: string;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}

    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getcategory();
            this.showbutton = true;
            console.log(this.id);
            this.CategoryForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
             });
        }
    }
    getcategory(){
      this.appservice.CategoryDetail(this.id)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.showErrorMsg = "";
                    this.CategoryForm = new FormGroup({
                        name: new FormControl(data.data[0].name, [Validators.required]),
                    });
                    
                }else{
                    this.showbutton = false;
                }
            }
        );
    }
    createcategory(){
        if(this.CategoryForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.CategoryForm.valid){
            this.loaderservice.display(true);
            this.appservice.addcategory(this.CategoryForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/category']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/category']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editcategory(){
        if(this.CategoryForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.CategoryForm.valid){
            this.loaderservice.display(true);
            this.appservice.editcategory(this.CategoryForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/category']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/category']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/category']);
    }
}


