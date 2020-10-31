import { Component, HostBinding } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import {Router} from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent{
    //Variables
    checkfooter :boolean = true;
    currentDate : Date = new Date();
    constructor(private cookieservice: CookieService ,private router: Router ){}
    ngOnInit(){
        if(!this.cookieservice.get("loginuserMerck")  && !this.cookieservice.get("loginsuperuserMerck")){
            this.checkfooter = false;
        }
    }
    goTocms(id) {
        this.router.navigate(['/getcmspage', id]);
    }
}
