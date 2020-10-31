import { Component, OnInit } from '@angular/core';
import {AppService} from '../../shared/services/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute ,Router} from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-offer',
    templateUrl: './create-offer.component.html',
    styleUrls: ['./create-offer.component.scss']
})

export class CreateOfferComponent implements OnInit{
    showbutton: boolean;
    id: any;
    OfferForm: FormGroup;
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
            this.getofferdata();
            this.showbutton = true;
            console.log(this.id);
            this.OfferForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required]),
            });
        }
    }
    getofferdata(){
        this.appservice.OfferDataid(this.id)
          .subscribe(
              data=>{
                  console.log(data);
                  if(data.status=='1')
                  {
                      this.showErrorMsg = "";
                      this.descen=data.data[0];
                      this.OfferForm = new FormGroup({
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
    createofferdata(image){
        if(this.OfferForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.OfferForm.valid){
            console.log(this.OfferForm);
            this.loaderservice.display(true);
            this.appservice.addOfferdata( this.OfferForm.value, this.fileName)
            .subscribe(
            data=>{
                console.log(data);
                if(data.status=='1')
                {
                    this.toasterservice.Success(data.message);   
                    this.router.navigate(['/offer']);                
                }else if(data.status=='2'){
                    this.toasterservice.Error(data.message);
                    this.router.navigate(['/offer']);  
                }else{
                    this.toasterservice.Error(data.message);
                }
            }
        );
            //console.log(this.UserForm.value);
        }
    }
    editofferdata(){
        if(this.OfferForm.invalid){
            this.toasterservice.Error("Please enter the required filed");
            return;
        }    
        if(this.OfferForm.valid){
            this.loaderservice.display(true);
            this.appservice.editofferdata(this.OfferForm.value,this.id,this.fileName)
            .subscribe(
                data=>{
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/offer']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/offer']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
        }
    }
    Gotolist(){
        this.router.navigate(['/offer']);
    }

}


