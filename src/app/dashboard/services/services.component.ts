import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})

export class ServicesComponent implements OnInit {
    Servicesdata: any;
    constructor(private appservice: AppService, private route: Router, private cookieservice: CookieService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck")) {
            this.route.navigate(['/auth']);
        }
        this.getservices();
    }

    getservices() {
        this.appservice.category(0,100)
            .subscribe(
                data => {
                    if (data.status == '1') {
                        this.Servicesdata = data.data;
                    }
                }
            );
    }
    goToCreateUser(id) {
        // alert();
        this.route.navigate(['/create-services', id]);
    }
    goToaddservices(id) {
        // alert();
        this.route.navigate(['/create-services', id]);
    }

}
