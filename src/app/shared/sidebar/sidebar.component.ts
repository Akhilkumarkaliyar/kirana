import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { Front } from './sidebar-routes.config';
import { Subuser } from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { AppService } from '../../shared/services/service';
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';
declare var $: any;

var fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
};

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: ['@media print{.doNotPrint{display:none !important;} }'],
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    cokser :any;
    coksersuper :any;
    inurl :any;
    loguser:any;
    usertype:any;
    printurl:any;
    constructor(private router: Router,private appservice: AppService,
        private route: ActivatedRoute, public translate: TranslateService, private cookieservice: CookieService, private elementRef: ElementRef) {
        
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        this.printurl = window.location.href;
        if(this.printurl.includes("viewinvoice")){
            console.log('true');
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent('resize', true, false);
            window.dispatchEvent(evt);
            console.log(evt);
        }
        this.cokser =JSON.parse(this.cookieservice.get("loginuserMerck"));
        this.loguser =JSON.parse(this.cookieservice.get("loginuserMerck")).id;
        this.usertype =JSON.parse(this.cookieservice.get("loginuserMerck")).usertype;
        console.log(this.usertype);
        if(this.usertype == 2){ 
            this.menuItems = Subuser.filter(menuItem => menuItem);
        }
        else if(this.usertype == 1){
            this.menuItems = ROUTES.filter(menuItem => menuItem);
        }
        else{
            this.menuItems = Front.filter(menuItem => menuItem);
        }
    }

    //NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf('forms/ngx') !== -1)
            this.router.navigate(['forms/ngx/wizard'], { skipLocationChange: false });
    }
    getRoute(route,icon){
        console.log(route,icon);
        if(route =='kirana/invoice'){
            this.appservice.billno(this.loguser)
            .subscribe(
                data => {
                    if(data.status=='1'){
                        this.inurl=route+'/'+data.data;
                        window.open(this.inurl,'_blank');
                    }
                }
            );
            //this.inurl='chemist/invoice';
            //window.open(route,'_blank');
        }else{
             this.router.navigate([route]); 
        }
    }

    
    onClick(event) {
        //initialize window resizer event on sidebar toggle click event
        setTimeout(() => { fireRefreshEventOnWindow() }, 300);
    }
}
