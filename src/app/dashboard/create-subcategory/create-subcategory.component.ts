import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { getBootstrapListener } from '@angular/router/src/router_module';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-subcategory',
    templateUrl: './create-subcategory.component.html',
    styleUrls: ['./create-subcategory.component.scss']
})

export class CreateSubCategoryComponent implements OnInit{
    id: string;
    showbutton: boolean;
    SubCategoryForm: FormGroup;
    showErrorMsg: string;
    categorydata :any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}

    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck") && !this.cookieservice.get("loginsuperuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.id = this.route.snapshot.paramMap.get('id');
        if(this.id){
            this.getsubcategory();
            this.showbutton = true;
            console.log(this.id);
            this.getCategory();
            this.SubCategoryForm = new FormGroup({
                cat_id: new FormControl("", [Validators.required]),
                name: new FormControl("", [Validators.required]),
            });
        }
    }
    getCategory(){
        this.appservice.category(0,100)
        .subscribe(
            data=>{
                if(data.status=='1'){
                    this.categorydata = data.data;
                }
            }
        );
    }
    getsubcategory(){
      this.appservice.SubCategoryDetail(this.id)
        .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.showErrorMsg = "";
                    this.SubCategoryForm = new FormGroup({
                        cat_id: new FormControl(data.data[0].cat_id, [Validators.required]),
                        name: new FormControl(data.data[0].name, [Validators.required]),
                     });
                    
                }else{
                    this.showbutton = false;
                }
            }
        );
    }
    createsubcategory(){
        if(this.SubCategoryForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.SubCategoryForm.valid){
            this.loaderservice.display(true);
            this.appservice.addsubcategory(this.SubCategoryForm.value)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/subcategory']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/subcategory']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editsubcategory(){
        if(this.SubCategoryForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.SubCategoryForm.valid){
            this.loaderservice.display(true);
            this.appservice.editsubcategory(this.SubCategoryForm.value,this.id)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/subcategory']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/subcategory']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/subcategory']);
    }
}


