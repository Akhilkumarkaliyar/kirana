import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class AppService {
    //baseurl = "http://localhost:8087/";
    baseurl = "http://ec2-13-233-172-180.ap-south-1.compute.amazonaws.com:8087/";

    constructor(private http: HttpClient) { }
    users(addedby): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "alldata",
            { addedby: addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    afterdiscount(tprice,distper,billid,addedby): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "afterdiscount",
            { tprice:tprice,distper:distper,billid:billid,addedby: addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    checkvalue(invoiceno,addedby): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "checkvalue",
            { invoiceno:invoiceno,addedby: addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    emptyvendorbill(addedby): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "emptyvendorbill",
            { addedby: addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    billno(addedby): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "billno",
            { addedby: addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deleteproduct(addedby,productid,billid): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "deleteproduct",
            { addedby: addedby,productid:productid,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    wholesaler(addedby,pagevalue): Observable<any> {
        console.log(pagevalue);
        return this.http.post<any>(
            this.baseurl + "wholesaler",
            { addedby: addedby,pagevalue:pagevalue},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    allvendorbill(addedby,vendorid): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "allvendorbill",
            {addedby:addedby,vendorid:vendorid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getbills(vendorid): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getbills",
            {vendorid:vendorid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    Detail(userid): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "detail",
            {userid:userid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    Nosale(): Observable<any> {
        return this.http.get<any>(this.baseurl + "nosale");
    }
    Fastsale(): Observable<any> {
        return this.http.get<any>(this.baseurl + "fastsale");
    }
    Slowsale(): Observable<any> {
        return this.http.get<any>(this.baseurl + "slowsale");
    }
    logout(): Observable<any> { 
        return this.http.get<any>(this.baseurl + "userout");
    }
    country():Observable<any>{
        return this.http.get<any>(this.baseurl + "country");
    } 
    product(addedby,pagevalue,totalrecord,sortby,gettype): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "product",
            { addedby: addedby,pagevalue:pagevalue,totalrecord:totalrecord,sortby:sortby,gettype:gettype},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    productsearchexpire(addedby,pagevalue,totalrecord,expiredatesearch): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "productsearchexpire",
            { addedby: addedby,pagevalue:pagevalue,totalrecord:totalrecord,expiredatesearch:expiredatesearch},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    orderproduct():Observable<any>{
        return this.http.get<any>(this.baseurl + "orderproduct");
    }
    contact():Observable<any>{
        return this.http.get<any>(this.baseurl + "contact");
    }
    blogdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "blog");
    }
    hsn():Observable<any>{
        return this.http.get<any>(this.baseurl + "hsn");
    }
    category(pagevalue,totalrecord): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "category",
            {pagevalue:pagevalue,totalrecord:totalrecord},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    subcategory(pagevalue,totalrecord): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "subcategory",
            {pagevalue:pagevalue,totalrecord:totalrecord},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getgst(hsn): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getgst",
            {hsn:hsn},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    testimonialdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "testimonial");
    }
    socialdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "social");
    }
    faqdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "faq");
    }
    metadata():Observable<any>{
        return this.http.get<any>(this.baseurl + "meta");
    } 
    offerdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "offer");
    } 
    services():Observable<any>{
        return this.http.get<any>(this.baseurl + "services");
    }
    carrier():Observable<any>{
        return this.http.get<any>(this.baseurl + "carrier");
    }
    addtocartdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "addtocart");
    }
    reviewdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "review");
    }
    soldproductdata(addedby,pagevalue): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "soldproduct",
            {addedby:addedby,pagevalue:pagevalue},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    nonpaidvendorbill(addedby,vendorid): Observable<any> {
        //console.log(vendorid);return;
        return this.http.post<any>(
            this.baseurl + "nonpaidvendorbill",
            {addedby:addedby,vendorid:vendorid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    comingproductdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "comingproduct");
    }
    stockproductdata(pagevalue,total,addedby,sortby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "stockproductdata",
            {pagevalue:pagevalue,totalrecord:total,addedby:addedby,sortby:sortby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    expireproductdata(pagevalue,total,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "expireproduct",
            {pagevalue:pagevalue,totalrecord:total,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    availableproductdata(addedby,pagevalue,totalrecord): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "availableproduct",
            { addedby: addedby,pagevalue:pagevalue,totalrecord:totalrecord},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getreport(startdate,enddate,pagevalue,totalrecord): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getreport",
            { startdate: startdate,enddate:enddate,pagevalue:pagevalue,totalrecord:totalrecord},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getcustomerreport(pagevalue,totalrecord,added_by): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getcustomerreport",
            { pagevalue:pagevalue,totalrecord:totalrecord,added_by:added_by},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getpurchasereport(addedby,id,pagevalue,totalrecord): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getpurchasereport",
            { addedby: addedby,id:id,pagevalue:pagevalue,totalrecord:totalrecord},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    expirethismonth():Observable<any>{
        return this.http.get<any>(this.baseurl + "expirethismonth");
    }
    monthsold():Observable<any>{
        return this.http.get<any>(this.baseurl + "monthsold");
    } 
    yearsold():Observable<any>{
        return this.http.get<any>(this.baseurl + "yearsold");
    } 
    billingdata(addedby,billid): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "billingdata",
            {addedby:addedby,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    viewbillingdata(addedby,id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "viewbillingdata",
            {addedby:addedby,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    cmsdata():Observable<any>{
        return this.http.get<any>(this.baseurl + "cmsdata");
    }
    cms():Observable<any>{
        return this.http.get<any>(this.baseurl + "cms");
    }
    wholesailer():Observable<any>{
        return this.http.get<any>(this.baseurl + "wholesailer");
    }
    adduser(id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "register",
            { fname: id.fname,city: id.city,country : id.country,lname:id.lname,hospital:id.hospital,email:id.email,mobile:id.mobile},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    edituser(formdata,id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "edituser",
            { fname: formdata.fname,city: formdata.city,country : formdata.country,lname:formdata.lname,hospital:formdata.hospital,email:formdata.email,mobile:formdata.mobile},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    resetpassword(formdata,id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "setpassword",
            { password: formdata.password,cpassword: formdata.cpassword,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    forgotpassword(formdata,id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "setpassword",
            { password: formdata.password,cpassword: formdata.cpassword,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    userDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "alldatabyuser",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    wholeDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "wholeDetail",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addproduct(id, file,loguser): Observable<any> {
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("cat_id", id.cat_id);
        uploaddata.append("name", id.name);
        uploaddata.append("mrp", id.mrp);
        uploaddata.append("gst", id.gst);
        uploaddata.append("hsn_code", id.hsn_code);
        uploaddata.append("barcode", id.barcode);
        uploaddata.append("company_name", id.company_name);
        uploaddata.append("quantity", id.quantity);
        uploaddata.append("loose", id.loose);
         uploaddata.append("batch_no", id.batch_no);
        uploaddata.append("perquantity", id.perquantity);
        uploaddata.append("addedby", loguser);
        uploaddata.append("discount",id.discount);
        return this.http.post<any>(
            this.baseurl + "createproduct",
            uploaddata,
        );
    }
    editproduct(formdata,id,file,loguser): Observable<any> {
        //console.log(formdata);return;
        if(file == undefined){
            file ='';
        }
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("cat_id", formdata.cat_id);
        uploaddata.append("name", formdata.name);
        uploaddata.append("mrp", formdata.mrp);
        //uploaddata.append("selling_price", formdata.selling_price);
        uploaddata.append("hsn_code", formdata.hsn_code);
        uploaddata.append("gst", formdata.gst);
        uploaddata.append("company_name", formdata.company_name);
        uploaddata.append("quantity", formdata.quantity);
        uploaddata.append("loose", formdata.loose);
        uploaddata.append("batch_no", formdata.batch_no);
         uploaddata.append("perquantity", formdata.perquantity);
        uploaddata.append("id", id);
        uploaddata.append("addedby", loguser);
        uploaddata.append("barcode",formdata.barcode);
        uploaddata.append("discount",formdata.discount);
        return this.http.post<any>(
            this.baseurl + "updateproduct",
            uploaddata
        );
    }
    ProductDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "productid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    } 
    stocksearch(formdata,addedby): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "stocksearch",
            { value: formdata.search,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    salesearch(formdata,addedby): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "salesearch",
            { value: formdata.search,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    productlist(addedby,searchproduct): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "productlist",
            { addedby:addedby,searchproduct:searchproduct},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    productsearch(formdata,addedby,pagevalue,totalrecord,sortby,gettype): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "productsearch",
            { value: formdata.search,addedby:addedby,pagevalue:pagevalue,totalrecord:totalrecord,sortby:sortby,gettype:gettype},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    productsearchss(formdata,addedby,salestype,billid): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "productsearchss",
            { value: formdata,addedby:addedby,salestype:salestype,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addvendorproduct(addedby,productsearch): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "addvendorproduct",
            { addedby:addedby,productsearch:productsearch},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addvendorproducts(addedby,productsearch,billid): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "addvendorproductlist",
            { addedby:addedby,productsearch:productsearch,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getbillproduct(addedby,billid): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getbillproduct",
            { addedby:addedby,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    createvendorproduct(addedby,productid,purchaseprice,mrp,quantity,expiredate,batchno): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "createvendorproduct",
            { addedby:addedby,productid:productid,purchaseprice:purchaseprice,mrp:mrp,quantity:quantity,expiredate:expiredate,batchno:batchno},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    updatebillproduct(addedby,productid,billid,mrp,quantity,expiredate,batchno,purchaseprice): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "updatebillproduct",
            { addedby:addedby,productid:productid,billid:billid,mrp:mrp,quantity:quantity,expiredate:expiredate,batchno:batchno,purchaseprice:purchaseprice},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    WholesalerDetail(id,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "wholesalerid",
            { id: id,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    getexcel(id,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "getexcel",
            { id: id,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addwholesaler(id,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "createwholesaler",
            { name : id.name,email : id.email,mobile : id.mobile, address : id.address,addedby :addedby,gstno:id.gstno},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    billingproductlist(id,loguser,salestype,billno,invodate,invoiceno,authname,tprice,discount,payamount): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "billingproductlist",
            { name : id.name,email : id.email,mobile : id.mobile, address : id.address,addedby :loguser,salestype:salestype,billno:billno,invodate:invodate,invoiceno:invoiceno,authname:authname,tprice:tprice,discount:discount,payamount:payamount},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editwholesaler(formdata,id,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "updatewholesaler",
            { name : formdata.name,email : formdata.email,mobile : formdata.mobile,address : formdata.address,addedby :addedby,gstno:formdata.gstno,id:id },
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    wholesalersearch(formdata,addedby): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "wholesalersearch",
            { value: formdata.search,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    faqsearch(formdata): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "faqsearch",
            { value: formdata.search},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addcontact(id): Observable<any> {
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createcontact",
            { name : id.name,email : id.email,mobile : id.mobile,fax : id.fax, address : id.address,license_no : id.license_no,expire_date :id.expire_date},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editcontact(formdata,id): Observable<any> {
        //console.log(id.name_ar);return;
        return this.http.post<any>(
            this.baseurl + "updatecontact",
            { name : formdata.name,email : formdata.email,mobile : formdata.mobile,fax : formdata.fax,address : formdata.address,license_no : formdata.license_no,expire_date : formdata.expire_date,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    ContactDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "contactid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletecontact(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletecontact",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addBlogdata(id, file): Observable<any> {
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("title", id.title);
        uploaddata.append("description", id.description);
        return this.http.post<any>(
            this.baseurl + "createblog",
            uploaddata,
        );
    }
    editblogdata(formdata,id,file): Observable<any> {
        //console.log(formdata);return;
        if(file == undefined){
            file ='';
        }
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("title", formdata.title);
        uploaddata.append("description", formdata.description);
        uploaddata.append("id", id);
        return this.http.post<any>(
            this.baseurl + "updateblog",
            uploaddata
        );
    }
    BlogDataid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "blogid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deleteblog(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deleteblog",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addcategory(id): Observable<any> {
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createcategory",
            { name : id.name},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editcategory(formdata,id): Observable<any> {
        //console.log(id.name_ar);return;
        return this.http.post<any>(
            this.baseurl + "updatecategory",
            { name : formdata.name,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    CategoryDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "categoryid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletecategory(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletecategory",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addsubcategory(id): Observable<any>{
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createsubcategory",
            { name : id.name,cat_id :id.cat_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editsubcategory(formdata,id): Observable<any> {
        //console.log(id.name_ar);return;
        return this.http.post<any>(
            this.baseurl + "updatesubcategory",
            { name : formdata.name,cat_id :formdata.cat_id,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    SubCategoryDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "subcategoryid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    SubCategorycatDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "subcategorycatid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletesubcategory(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletesubcategory",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addTestimonialdata(id, file): Observable<any> {
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", id.name);
        uploaddata.append("description", id.description);
        return this.http.post<any>(
            this.baseurl + "createtestimonial",
            uploaddata,
        );
    }
    edittestimonialdata(formdata,id,file): Observable<any> {
        //console.log(formdata);return;
        if(file == undefined){
            file ='';
        }
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", formdata.name);
        uploaddata.append("description", formdata.description);
        uploaddata.append("id", id);
        return this.http.post<any>(
            this.baseurl + "updatetestimonial",
            uploaddata
        );
    }
    TestimonialDataid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "testimonialid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletetestimonial(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletetestimonial",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addSocialdata(id, file): Observable<any> {
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", id.name);
        uploaddata.append("link", id.link);
        return this.http.post<any>(
            this.baseurl + "createsocial",
            uploaddata,
        );
    }
    editsocialdata(formdata,id,file): Observable<any> {
        //console.log(formdata);return;
        if(file == undefined){
            file ='';
        }
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", formdata.name);
        uploaddata.append("link", formdata.link);
        uploaddata.append("id", id);
        return this.http.post<any>(
            this.baseurl + "updatesocial",
            uploaddata
        );
    }
    SocialDataid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "socialid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletesocial(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletesocial",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addFaqdata(id, file): Observable<any> {
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", id.name);
        uploaddata.append("description", id.description);
        return this.http.post<any>(
            this.baseurl + "createfaq",
            uploaddata,
        );
    }
    editfaqdata(formdata,id,file): Observable<any> {
        //console.log(formdata);return;
        if(file == undefined){
            file ='';
        }
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", formdata.name);
        uploaddata.append("description", formdata.description);
        uploaddata.append("id", id);
        return this.http.post<any>(
            this.baseurl + "updatefaq",
            uploaddata
        );
    }
    FaqDataid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "faqid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletefaq(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletefaq",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addMetadata(id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "createmetadata",
            { name: id.name,title: id.title,description : id.description},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editmetadata(formdata,id): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "updatemetadata",
            { name: formdata.name,title: formdata.title,description : formdata.description,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    MetaDataid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "metaid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletemeta(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletemeta",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addOfferdata(id, file): Observable<any> {
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", id.name);
        uploaddata.append("description", id.description);
        return this.http.post<any>(
            this.baseurl + "createoffer",
            uploaddata,
        );
    }
    editofferdata(formdata,id,file): Observable<any> {
        //console.log(formdata);return;
        if(file == undefined){
            file ='';
        }
        const uploaddata = new FormData();
        uploaddata.append("image", file);
        uploaddata.append("name", formdata.name);
        uploaddata.append("description", formdata.description);
        uploaddata.append("id", id);
        return this.http.post<any>(
            this.baseurl + "updateoffer",
            uploaddata
        );
    }
    OfferDataid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "offerid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deleteoffer(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deleteoffer",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addservices(id): Observable<any> {
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createservices",
            { name : id.name},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editservices(formdata,id): Observable<any> {
        //console.log(id.name_ar);return;
        return this.http.post<any>(
            this.baseurl + "updateservices",
            { name : formdata.name,id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    ServicesDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "servicesid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deleteservices(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deleteservices",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addcarrier(id): Observable<any> {
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createcarrier",
            { name : id.name,last_date :id.last_date},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editcarrier(formdata,id): Observable<any> {
        //console.log(id.name_ar);return;
        return this.http.post<any>(
            this.baseurl + "updatecarrier",
            { name : formdata.name,id:id,last_date :formdata.last_date},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    CarrierDetail(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "carrierid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletecarrier(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletecarrier",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deleteaddtocart(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deleteaddtocart",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletereview(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletereview",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletesoldproduct(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletesoldproduct",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletecomingproduct(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletecomingproduct",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    } 
    deleteexpireproduct(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deleteexpireproduct",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    } 
    deleteavailableproduct(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deleteavailableproduct",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    deletebilling(id,addedby,billid): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "deletebilling",
            { id:id,addedby:addedby,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    autoorder(id,added_by): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "autoorder",
            { id:id,added_by:added_by},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addbilling(id,billid): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "addbilling",
            { id:id,billid:billid},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    discrequantity(id,product_id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "discrequantity",
            { id:id,product_id:product_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    } 
    increquantity(id,product_id,quantity,salestype,addedby,userid,loose): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "increquantity",
            { id:id,product_id:product_id,quantity:quantity,salestype:salestype,addedby:addedby,userid:userid,loose:loose},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    discrequantityorder(id,product_id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "discrequantityorder",
            { id:id,product_id:product_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    } 
    increquantityorder(id,product_id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "increquantityorder",
            { id:id,product_id:product_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    genratebill(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "genratebill",
            { id:id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addcms(id): Observable<any> {
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createcms",
            { name : id.name,description :id.description,cms_id :id.cms_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editcms(formdata,id): Observable<any> {
        //console.log(id.name_ar);return;
        return this.http.post<any>(
            this.baseurl + "updatecms",
            { name : formdata.name,id:id,description :formdata.description,cms_id :formdata.cms_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    } 
    cmsnamedata(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "cmsnamedata",
            { cms_id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    Cmsid(id): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "Cmsid",
            { id: id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    vendorbill(addedby,pagevalue,totalrecord): Observable<any> {
        //console.log(pageno);return;
        return this.http.post<any>(
            this.baseurl + "vendorbill",
            { addedby: addedby,pagevalue:pagevalue,totalrecord:totalrecord},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    Vendorbillsearch(formdata,addedby): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "vendorbillsearch",
            { value: formdata.search,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    vendorbillDetail(id,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "vendorbillid",
            { id: id,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addvendorbill(id,amount,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "createvendorbill",
            { vendor_id : id.vendor_id,bill_no : id.bill_no, amount : amount,addedby :addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editvendorbill(formdata,id,addedby,billdate): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "updatevendorbill",
            { vendor_id : formdata.vendor_id,bill_no : formdata.bill_no,bill_date : billdate,amount : formdata.amount,addedby :addedby,id:id },
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    vendorpayment(addedby,pagevalue): Observable<any> {
        //console.log(id);return;
        return this.http.post<any>(
            this.baseurl + "vendorpayment",
            { addedby: addedby,pagevalue:pagevalue},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    vendorpaymentsearch(formdata,addedby): Observable<any> {
        //console.log(formdata.search);
        return this.http.post<any>(
            this.baseurl + "vendorpaymentsearch",
            { value: formdata.search,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    vendorpaymentDetail(id,addedby): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "vendorpaymentid",
            { id: id,addedby:addedby},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    addvendorpayment(id,addedby,paidamount,pendingamount,vendor_id): Observable<any> {
        console.log(id);
        return this.http.post<any>(
            this.baseurl + "createvendorpayment",
            { bill_id : id.bill_id, mode :id.mode,addedby :addedby,paidamount:paidamount,pendingamount:pendingamount,vendor_id:vendor_id},
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    editvendorpayment(formdata,id,addedby,payment_date): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "updatevendorpayment",
            { vendor_id : formdata.vendor_id,bill_id : formdata.bill_id,payment_date : payment_date,amount : formdata.amount,mode :formdata.mode,addedby :addedby,id:id },
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
    userLogin(email, password): Observable<any> {
        return this.http.post<any>(
            this.baseurl + "login",
            { email: email, password: password },
            {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }
        );
    }
}