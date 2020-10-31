import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-expirethismonth',
    templateUrl: './expirethismonth.component.html',
    styleUrls: ['./expirethismonth.component.scss']
})

export class ExpirethismonthComponent implements OnInit {
    Expiremonthdata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getExpiremonth();
    }

    getExpiremonth() {
        this.appservice.expirethismonth()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Expiremonthdata = data.data;
                    }
                }
            );
    }
}
