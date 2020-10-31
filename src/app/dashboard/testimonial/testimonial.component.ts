import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router,ActivatedRoute } from '@angular/router';
import {ToasterService} from '../../shared/services/toaster.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: 'app-testimonial',
    templateUrl: './testimonial.component.html',
    styleUrls: ['./testimonial.component.scss']
})

export class TestimonialComponent implements OnInit {
    Testimonialdata: any;
    constructor(private appservice: AppService,private router: Router, private route: ActivatedRoute, private toasterservice: ToasterService, private loaderservice: LoaderService, private cookieservice: CookieService ){}
    ngOnInit() {
        if(!this.cookieservice.get("loginuserMerck")){
            this.router.navigate(['/auth']);
        }
        this.getTestimonialdata();
    }

    getTestimonialdata() {
        this.appservice.testimonialdata()
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.Testimonialdata = data.data;
                    }
                }
            );
    }
    goToCreatedata(id) {
        // alert();
        this.router.navigate(['/create-testimonial',id]);
    }
    deleteTestimonialdata(id){
        this.appservice.deletetestimonial(id)
            .subscribe(
                data => {
                    console.log(data);
                    if(data.status=='1')
                    {
                        this.toasterservice.Success(data.message);   
                        this.router.navigate(['/testimonial']);                
                    }else if(data.status=='2'){
                        this.toasterservice.Error(data.message);
                        this.router.navigate(['/testimonial']);  
                    }else{
                        this.toasterservice.Error(data.message);
                    }
                }
            );
    }

}
