import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-cms',
    templateUrl: './cms.component.html',
    styleUrls: ['./cms.component.scss']
})

export class CmsComponent implements OnInit {
    Cmsdata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getCmsdata();
    }

    getCmsdata() {
        this.appservice.cmsdata()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Cmsdata = data.data;
                    }
                }
            );
    }
    goToCreatedata(id) {
        // alert();
        this.router.navigate(['/create-cms',id]);
    }
}
