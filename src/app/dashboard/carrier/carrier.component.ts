import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-carrier',
    templateUrl: './carrier.component.html',
    styleUrls: ['./carrier.component.scss']
})

export class CarrierComponent implements OnInit {
    Carrierdata: any;
    constructor(private appservice: AppService, private route: Router, private cookieservice: CookieService) { }

    ngOnInit() {
        if (!this.cookieservice.get("loginuserMerck")) {
            this.route.navigate(['/auth']);
        }
        this.getcarrier();
    }

    getcarrier() {
        this.appservice.carrier()
            .subscribe(
                data => {
                    if (data.status == '1') {
                        this.Carrierdata = data.data;
                    }
                }
            );
    }
    goToCreatecarrier(id) {
        // alert();
        this.route.navigate(['/create-carrier', id]);
    }
    goToaddcarrier(id) {
        // alert();
        this.route.navigate(['/create-carrier', id]);
    }

}
