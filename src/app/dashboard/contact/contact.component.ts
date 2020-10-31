import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { ActivatedRoute,Router } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {
    Contactdata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService  ){}

    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getContact();
    }

    getContact() {
        this.appservice.contact()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Contactdata = data.data;
                    }
                }
            );
    }
    goToCreateContact(id) {
        this.router.navigate(['/create-contact', id]);
    }
    goToaddcontact(id) {
        this.router.navigate(['/create-contact', id]);
    }
    deleteContact(id){
        this.appservice.deletecontact(id)
            .subscribe(
                data => {
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
