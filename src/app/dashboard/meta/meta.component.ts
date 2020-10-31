import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-meta',
    templateUrl: './meta.component.html',
    styleUrls: ['./meta.component.scss']
})

export class MetaComponent implements OnInit {
    meta: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getMetadata();
    }

    getMetadata() {
        this.appservice.metadata()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.meta = data.data;
                    }
                }
            );
    }
    goToCreatedata(id) {
        // alert();
        this.router.navigate(['/create-meta',id]);
    }
    deleteMetadata(id){
        this.appservice.deletemeta(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/meta']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/meta']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }

}
