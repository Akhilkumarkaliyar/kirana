import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-addtocart',
    templateUrl: './addtocart.component.html',
    styleUrls: ['./addtocart.component.scss']
})

export class AddtocartComponent implements OnInit {
    Addtocartdata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getAddtocartdata();
    }

    getAddtocartdata() {
        this.appservice.addtocartdata()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Addtocartdata = data.data;
                    }
                }
            );
    }
    deleteAddtocartdata(id){
        this.appservice.deleteaddtocart(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/addtocart']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/addtocart']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }

}
