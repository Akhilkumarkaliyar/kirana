import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss']
})

export class OfferComponent implements OnInit {
    Offerdata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck") ){
            this.router.navigate(['/auth']);
        }
        this.getOfferdata();
    }

    getOfferdata() {
        this.appservice.offerdata()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Offerdata = data.data;
                    }
                }
            );
    }
    goToCreatedata(id) {
        // alert();
        this.router.navigate(['/create-offer',id]);
    }
    deleteOfferdata(id){
        this.appservice.deleteoffer(id)
            .subscribe(
                data => {
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
