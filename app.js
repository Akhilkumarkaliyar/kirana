var express =  require('express');
var mysql  = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var { check, validationResult } = require('express-validator/check');
var session = require('express-session');
var mailer = require('express-mailer');
var d = new Date();
var today = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
var lastdays = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + (d.getDate()-1);
var lastmonth = d.getFullYear() + "-" + (d.getMonth()+2) + "-" + d.getDate();
app.use(express.static('public'));
mailer.extend(app, {
  from: 'no-reply@galdermamiddleast.com',
  host: 'in-v3.mailjet.com', // hostname
  secureConnection: false, // use SSL
  port: 587, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: '5cf69fab2a134d73fd33e9b1d25708b7',
    pass: 'db308f5ace974b5d4a2d009700aaf1f7'
  }
});
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        if (req.method === 'OPTIONS') return res.send(200)
    }
    next()
});
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'kirana-api/public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//********Database Parameter************//
var connection =mysql.createConnection({
    //properties
    host : 'localhost',
    user : 'artist',
    password : 'root@2019',
    database : 'kirana'
});
//********Database Parameter************//
//********Database Connection************//
connection.connect(function(error){
    if(!!error){
        console.log('error');
    } else {
        console.log('connected');
    }
});

app.get('/sendmail', function (req, res, next) {
  app.mailer.send('email', {
    to: 'akhil.kaliyar1992@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
    subject: 'Set Your Password', // REQUIRED.
    otherProperty: 'Link to forgot your password http://localhost:4200/appuser', // All additional properties are also passed to the template as local variables.
	}, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
});
//***************************genrate bill********************//
app.get('/genratebill', function(req, res)
{
    var pdf = require('pdfkit');
	var fs = require('fs');
	var mydoc = new pdf;
	mydoc.pipe(fs.createWriteStream('public/pdf/node.pdf'));
	mydoc.font('Times-Roman')
		.fontSize(48)
		.text('Hello Akhil',100,100);
	mydoc.end();
	
});
//***************************genrate bill********************//
//************forgot password**************//
app.post('/forgot' ,function(req, res){
	var email= req.body.email;
    connection.query("select * from mr_users where email = ?" ,[email] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			userid =result[0].id;
			//console.log(userid);return;
			if(numRows > 0)
			{
				app.mailer.send('email', {
					//to: 'akhil.kaliyar1992@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
					to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
					subject: 'Forgot Password', // REQUIRED.
					otherProperty: "Link to forgot your password http://localhost:4200/forgot/"+userid // All additional properties are also passed to the template as local variables.
				}, function (err) {
					if (err) {
					  // handle error
					  console.log(err);
					  res.send({
						  "code":200,
						  "message":"There was an error sending the email",
						  "status":2,
						});
						return;
					}
					res.send({
					  "code":200,
					  "message":"email send sucuessfully on register email",
					  "status":1,
					});
				});
				
			}else{
				res.send({
				  "code":200,
				  "message":"user doesn't exit in our record",
				  "status":3,
				});
			}
			//console.log(result);
        } 
    });
});
//************forgot password**************//

//********Database Connection************//
app.post('/upload',upload.single('file'),function(req, res, next) {
  console.log(req.file);
  if(!req.file) {
    res.status(500);
    return next(err);
  }
  res.json({ fileUrl: req.file.path });
})
//********All User List************//
app.post('/alldata' ,function(req, res){
	var addedby= req.body.addedby;
	connection.query("select * from ch_users where parent_id = ?" ,[addedby] ,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"User List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
//********All User List************//
//********All User Detail************//
app.post('/alldatabyuser' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_users where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"User Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"User Detail",
				  "status":2,
				  "data":result
				});
			}
			//console.log(result);
        } 
    });
});
//********All User Detail************//
//********User Register ************//
app.post('/setpassword', function(req, res){
	var saltRounds = 10;
	var password=req.body.password;
	var cpassword=req.body.cpassword;
	var id=req.body.id;
	if(password == cpassword)
	{
		bcrypt.hash(req.body.password, saltRounds, function (err,hash) {
			var users={
				"password":hash,
				"expirelink":1,
			}
			connection.query("select * from mr_users where id = ?" ,[id], function (error, result, fields) 
			{
				if (error) 
				{
					res.send({
					  "status":3,
					  "failed":"Something went wrong!!!"
					})
				}else
				{
					numRows = result.length;
					if(numRows > 0)
					{
						connection.query('update mr_users SET ?  where id = ?',[users,id], function (error, result, fields) 
						{
							if (error) 
							{
								console.log(error);
								res.send({
								  "status":3,
								  "failed":"Something went wrong!!!"
								});
							}else{
								numRows = result.affectedRows;
								if(numRows > 0)
								{
									res.send({
									  "message":"Password set sucessfully",
									  "status":1,
									});
									
								}else{
									res.send({
									  "status":2,
									  "message":"User does not exit in our record"
									});
								}
							}
						});	
					}
				}
			});
		});
	}else{
		res.send({
			  "status":2,
			  "message":"Password and confirm password not match."
			})
	}
});

app.post('/login', function(req, res){
	var ranstr = Math.random().toString(36).replace('0.', '') ;
	var email= req.body.email;
	var password = req.body.password;
	connection.query('SELECT * FROM ch_users WHERE email = ?',[email], function (error, results, fields)
	{
		if (error) 
		{
			res.send({
				"code":400,
				"failed":"error ocurred"
			})
		}else
		{
			if(results.length >0)
			{
				bcrypt.compare(password, results[0].password, function (err, result) 
				{
					connection.query('update ch_users set login_token =? WHERE email = ?',[ranstr,email], function (error, result, fields)
					{
						var sess = req.session;  //initialize session variable
						req.session.userId = results[0].id; //set user id
						req.session.email = results[0].email;//set user name
						ssn = req.session;
					});
					if(result == true){
						connection.query('SELECT * FROM ch_users WHERE email = ?',[email], function (error, resu, fields)
						{
							if (error) 
							{
								res.send({
									"code":400,
									"failed":"error ocurred"
								})
							}else
							{
								if(resu[0].usertype == '1')
								{
									res.send({
										"status":'1',
										"message":"login sucessful",
										"data":resu[0],
										"excelbaseurl":'http://localhost:8085/',
										"usertype":'1',
									});
								}else if(resu[0].usertype == '2'){
									res.send({
										"status":'1',
										"message":"login sucessful",
										"data":resu[0],
										"excelbaseurl":'http://localhost:8085/',
										"usertype":'2',
									});
								}
							}
						});
					}
					else{
						res.send({
							"status":'0',
							"message":"Email or password does not match"
						});
					}
				});
			}
			else{
				res.send({
					"status":'0',
					"message":"Email does not exits"
				});
			}
		}
	});
});
app.get('/country' ,function(req, res){
	var sql ="select * from mr_country";
    connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Country List",
				  "status":'1',
				  "data":result
				});
        }  
    });
}); 
app.post('/soldproduct' ,function(req, res){
    var addedby= req.body.addedby;
    var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = 10;
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,ts.amount,p.selling_price,p.company_name,ts.quantity,p.expire_date,c.name as cname,c.id as cid FROM  ch_selling as ts JOIN ch_product as p ON p.id= ts.product_id JOIN ch_category as c ON p.cat_id= c.id  where added_by='"+addedby+"' LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_product where added_by='"+addedby+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Product List",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product List",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result
				});
			}
        } 
    });
});
app.post('/getreport' ,function(req, res){
	var totalrecord= req.body.totalrecord;
	var start= req.body.startdate;
	var end= req.body.enddate;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	var sql ="SELECT distinct(product_id),sum(ts.totalprice) as totalamount, sum(ts.quantity) as salequantity,p.id,p.name,p.image,p.img_path,p.chemical_name,p.selling_price,p.company_name,p.quantity as availablequantity,p.expire_date,c.name as cname,c.id as cid FROM  ch_billing_product_list as ts JOIN ch_product as p ON p.id= ts.product_id JOIN ch_category as c ON p.cat_id= c.id  where ts.created_date between '"+start+"' and '"+end+"' GROUP BY `product_id` LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":error,
				 });
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_billing_product_list as ts JOIN ch_product as p ON p.id= ts.product_id JOIN ch_category as c ON p.cat_id= c.id    where ts.created_date between '"+start+"' and '"+end+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Product Detail!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product Detail!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result,
				  "record":'',
				});
			}
		} 
    });
});
app.post('/availableproduct' ,function(req, res){
    var addedby= req.body.addedby;
	var totalrecord= req.body.totalrecord;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where expire_date >= '"+today+"' and  available_date <= '"+today+"' and added_by ='"+addedby+"' LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_product where added_by='"+addedby+"' and expire_date >= "+today+" and  available_date <= "+today+"";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Product Listing!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product Listing!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result
				});
			}
        } 
    });
});
app.post('/expireproduct' ,function(req, res){
	
	var addedby= req.body.addedby;
	var totalrecord= req.body.totalrecord;
    var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	var sql ="SELECT p.id,p.name,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where expire_date <= '"+lastmonth+"' and added_by='"+addedby+"' LIMIT "+pagecount+","+endcount+" ";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			console.log(result);
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_product where expire_date <= "+lastmonth+" and added_by='"+addedby+"' ";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Product List!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product List!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'1',
				  "data":result,
				  "record":'',
				});
			}
        } 
    });
});
app.post('/stockproductdata' ,function(req, res){
	
	var addedby= req.body.addedby;
	var totalrecord= req.body.totalrecord;
    var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	var sql ="SELECT p.id,p.name,p.chemical_name,p.mrp,p.gst,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,p.rack_no FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where quantity <=10 and added_by='"+addedby+"' LIMIT "+pagecount+","+endcount+" ";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":error
				});
        } else {
			console.log(result);
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_product where quantity >='10' and added_by='"+addedby+"' ";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Product List!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product List!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'1',
				  "data":result,
				  "record":'',
				});
			}
        } 
    });
});
app.get('/expirethismonth' ,function(req, res){
    
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where expire_date >= CAST(CURRENT_TIMESTAMP AS DATE)";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Product List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.get('/comingproduct' ,function(req, res){
    
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where available_date > CAST(CURRENT_TIMESTAMP AS DATE)";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Product List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/product' ,function(req, res){
    var totalrecord = req.body.totalrecord;
    var addedby= req.body.addedby;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	//console.log(totalrecord);
	
	var sql ="SELECT p.id as sno,p.name,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.rack_no,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where added_by='"+addedby+"' LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_product where added_by='"+addedby+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 1){
							res.send({
							  "message":"Product Listing!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product Detail!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result
				});
			}
        } 
    });
});
app.post('/productid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_product where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Product Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Product Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
}); 
app.post('/productlist' ,function(req, res){
	var search= req.body.searchproduct;
	var addedby= req.body.addedby;
	//sql="SELECT * FROM ch_product WHERE name LIKE '%"+search+"%'";
	var sql="SELECT p.id as sno,p.name,p.chemical_name,p.mrp,p.gst,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id WHERE (p.name LIKE '%"+search+"%' OR p.chemical_name LIKE '%"+search+"%' or p.company_name LIKE '%"+search+"%' or p.rack_no LIKE '%"+search+"%' or p.batch_no LIKE '%"+search+"%' or p.barcode LIKE '%"+search+"%') and p.added_by='"+addedby+"'";
    connection.query(sql,function(error, result , fields){
        
		if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			var sql ="SELECT count(*) as rows FROM  ch_product where added_by='"+addedby+"'";
			connection.query(sql,function(error, results , fields){
				if(!!error){
					res.send({
						  "message":"Something Went wrong!",
						  "status":'3',
						});
				} else {
					var countrecord =results[0].rows;
					if(countrecord < 10){
						res.send({
						  "message":"Product Listing!",
						  "status":'1',
						  "data":result,
						  "record":'',
						});
					}else{
						res.send({
						  "message":"Product Detail!",
						  "status":'1',
						  "data":result,
						  "record":countrecord,
						});
					}
					
				}
			});
			//console.log(result);
        } 
    });
});
app.post('/productsearch' ,function(req, res){
	var search= req.body.value;
	var addedby= req.body.addedby;
	var totalrecord = req.body.totalrecord;
    var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	//console.log(totalrecord);
	
	var sql ="SELECT p.id as sno,p.name,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.rack_no,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where (p.name LIKE '%"+search+"%' OR p.chemical_name LIKE '%"+search+"%' or p.company_name LIKE '%"+search+"%' or p.rack_no LIKE '%"+search+"%' or p.batch_no LIKE '%"+search+"%' or p.barcode LIKE '%"+search+"%') and added_by='"+addedby+"' LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        
		if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":error
				});
        } else {
			numRows = result.length;
			var sql ="SELECT count(*) as rows FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where (p.name LIKE '%"+search+"%' OR p.chemical_name LIKE '%"+search+"%' or p.company_name LIKE '%"+search+"%' or p.rack_no LIKE '%"+search+"%' or p.batch_no LIKE '%"+search+"%' or p.barcode LIKE '%"+search+"%') and added_by='"+addedby+"'";
			connection.query(sql,function(error, results , fields){
				if(!!error){
					res.send({
						  "message":"Something Went wrong!",
						  "status":error,
						});
				} else {
					var countrecord =results[0].rows;
					if(countrecord < 10){
						res.send({
						  "message":"Product Listing!",
						  "status":'1',
						  "data":result,
						  "record":'',
						});
					}else{
						res.send({
						  "message":"Product Detail!",
						  "status":'1',
						  "data":result,
						  "record":countrecord,
						});
					}
					
				}
			});
			//console.log(result);
        } 
    });
});
app.post('/stocksearch' ,function(req, res){
	var search= req.body.value;
	var addedby= req.body.addedby;
	var sql ="SELECT p.id,p.name,p.chemical_name,p.mrp,p.gst,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,p.rack_no FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id where (p.name LIKE '%"+search+"%' OR p.chemical_name LIKE '%"+search+"%' or p.company_name LIKE '%"+search+"%' or p.rack_no LIKE '%"+search+"%' or p.	batch_no LIKE '%"+search+"%' or p.barcode LIKE '%"+search+"%') and quantity <='10'";
	connection.query(sql,function(error, result , fields){
        
		if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Product Detail",
				  "status":1,
				  "data":result,
				  "record":''
				});
			}else{
				res.send({
				  "message":"Product Detail",
				  "status":1,
				  "data":result,
				  "record":''
				});
			}
			//console.log(result);
        } 
    });
});
app.post('/createproduct',upload.single('image'),function(req, res, next){ 
	//console.log(req.body.perquantity);
	var perquantity = req.body.perquantity; 
	var loose = req.body.loose;
	var mrp = req.body.mrp;
	if(perquantity == ''){
		var perquantity = 1;
	}else{
		var perquantity = perquantity;
	}
	if(loose == ''){
		var loose = 0;
	}else{
		var loose = loose;
	}
	if(quantity == 0){
		var looseprice = (loose/perquantity)*mrp;
		var pricepertablet = mrp/looseprice;
	}else{
		var pricepertablet = mrp/perquantity;
	}
	if(req.file ==undefined){
		
		var quantity = req.body.quantity;
		var totalcou = (quantity*perquantity);
		var totalcount = parseInt(totalcou)+parseInt(loose);
		
		var product={
			"cat_id":req.body.cat_id,
			//"subcat_id":req.body.subcat_id,
			"name":req.body.name,
			"chemical_name":req.body.chemical_name,
			"mrp":mrp,
			"selling_price":mrp,
			//"available_price":req.body.available_price,
			"gst":req.body.gst,
			"hsn_code":req.body.hsn_code,
			"company_name":req.body.company_name,
			"quantity":quantity,
			"loose":loose,
			"perquantity":perquantity,
			"totalcount":totalcount,
			"rack_no":req.body.rack_no,
			"batch_no":req.body.batch_no,
			"is_prescription":req.body.is_prescription,
			"pricepertablet":pricepertablet,
			"expire_date":req.body.expire_date,
			//"available_date":req.body.available_date,
			"added_by":req.body.addedby,
			"barcode":req.body.barcode,
			"created_date":today,
			"modified_date":today
		}
	}else{
		var quantity = req.body.quantity;
		var totalcou = (quantity*perquantity);
		var totalcount = parseInt(totalcou)+parseInt(loose);
		var product={
			"cat_id":req.body.cat_id,
			//"subcat_id":req.body.subcat_id,
			"name":req.body.name,
			"chemical_name":req.body.chemical_name,
			"mrp":req.body.mrp,
			"selling_price":req.body.mrp,
			//"available_price":req.body.available_price,
			"gst":req.body.gst,
			"hsn_code":req.body.hsn_code,
			"company_name":req.body.company_name,
			"quantity":quantity,
			"loose":loose,
			"perquantity":perquantity,
			"totalcount":totalcount,
			"rack_no":req.body.rack_no,
			"expire_date":req.body.expire_date,
			//"available_date":req.body.available_date,
			"batch_no":req.body.batch_no,
			"is_prescription":req.body.is_prescription,
			"image":req.file.filename,
			"img_path":req.file.path,
			"barcode":req.body.barcode,
			"added_by":req.body.addedby,
			"created_date":today,
			"modified_date":today,
			"pricepertablet":pricepertablet,
		}
	}
	
		//console.log(product);return;
		connection.query('INSERT INTO ch_product SET ?',product, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":error
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Product added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Product not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updateproduct',upload.single('image'),function(req, res, next){ 
	//console.log(req.body.perquantity);
	var perquantity = req.body.perquantity;
	var loose = req.body.loose;
	var mrp = req.body.mrp;
	if(perquantity == ''){
		var perquantity = 1;
	}else{
		var perquantity = perquantity;
	}
	
	if(loose == 'null'){
		var loose = 0;
	}else{
		var loose = loose;
	}
	if(quantity == 0){
		var looseprice = (loose/perquantity)*mrp;
		var pricepertablet = mrp/looseprice;
	}else{
		var pricepertablet = mrp/perquantity;
	}
	if(req.file ==undefined){
		var quantity = req.body.quantity; 
		var totalcou = (quantity*perquantity);
		var totalcount = parseInt(totalcou)+parseInt(loose);
		var product={
			"cat_id":req.body.cat_id,
			//"subcat_id":req.body.subcat_id,
			"name":req.body.name,
			"chemical_name":req.body.chemical_name,
			"mrp":mrp,
			"selling_price":mrp,
			//"available_price":req.body.available_price,
			"gst":req.body.gst,
			"hsn_code":req.body.hsn_code,
			"rack_no":req.body.rack_no,
			"batch_no":req.body.batch_no,
			"is_prescription":req.body.is_prescription,
			"company_name":req.body.company_name,
			"quantity":quantity,
			"loose":loose,
			"totalcount":totalcount,
			"expire_date":req.body.expire_date,
			"barcode":req.body.barcode,
			"perquantity":perquantity,
			//"available_date":req.body.available_date,
			"modified_date":today,
			"pricepertablet":pricepertablet,
		}
	}else{
		var quantity = req.body.quantity;
		var totalcou = (quantity*perquantity);
		var totalcount = parseInt(totalcou)+parseInt(loose);
		var product={
			"cat_id":req.body.cat_id,
			//"subcat_id":req.body.subcat_id,
			"name":req.body.name,
			"chemical_name":req.body.chemical_name,
			"mrp":mrp,
			"selling_price":mrp,
			//"available_price":req.body.available_price,
			"gst":req.body.gst,
			"hsn_code":req.body.hsn_code,
			"company_name":req.body.company_name,
			"quantity":req.body.quantity,
			"loose":loose,
			"totalcount":totalcount,
			"expire_date":req.body.expire_date,
			"rack_no":req.body.rack_no,
			"batch_no":req.body.batch_no,
			"is_prescription":req.body.is_prescription,
			//"available_date":req.body.available_date,
			"image":req.file.filename,
			"barcode":req.body.barcode,
			"perquantity":perquantity,
			"img_path":req.file.path,
			"modified_date":today,
			"pricepertablet":pricepertablet,
		}
	}
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_product  SET ? where id =?',[product,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Product updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Product not updated sucessfully"
				});
			}
			
		}
	});
});
//////*************************Contact***************/////////////////
app.get('/contact' ,function(req, res){
    connection.query("select * from ch_pharmacy",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Pharmacy List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/contactid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_pharmacy where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Pharmacy Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Pharmacy Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createcontact', function(req, res){ 
	var contact={
			"name":req.body.name,
			"email":req.body.email,
			"mobile":req.body.mobile,
			"fax":req.body.fax,
			"address":req.body.address,
			"license_no":req.body.license_no,
			"expire_date":req.body.expire_date,
			"created_date":today,
			"modified_date":today
		}
		//console.log(contact);return;
		connection.query('INSERT INTO ch_pharmacy SET ?',contact, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Pharmacy added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Pharmacy not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatecontact', function(req, res){ 
	var contact={
			"name":req.body.name,
			"email":req.body.email,
			"mobile":req.body.mobile,
			"fax":req.body.fax,
			"address":req.body.address,
			"license_no":req.body.license_no,
			"expire_date":req.body.expire_date,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_pharmacy  SET ? where id =?',[contact,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Pharmacy updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Pharmacy not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletecontact', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_pharmacy  SET is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_pharmacy where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Pharmacy List updated Sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Pharmacy not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Contact***************/////////////////
//////*************************Meta data***************/////////////////
app.get('/meta' ,function(req, res){
    connection.query("select * from ch_meta",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Meta Data List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/metaid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_meta where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Meta Data Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Meta Data Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createmetadata', function(req, res){ 
	var meta={
			"name":req.body.name,
			"title":req.body.title,
			"description":req.body.description,
			"status" : 1,
			"created_date":today,
			"modified_date":today
		}
		//console.log(meta);return;
		connection.query('INSERT INTO ch_meta SET ?',meta, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Meta Data added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Meta Data not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatemetadata', function(req, res){ 
	var meta={
			"name":req.body.name,
			"title":req.body.title,
			"description":req.body.description,
			"status" : 1,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_meta  SET ? where id =?',[meta,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Meta Data updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Meta Data not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletemetadata', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_meta  SET 	is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_meta where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Meta data List updated Sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Meta Data not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Meta data***************/////////////////
//////*************************Carrier***************/////////////////
app.get('/carrier' ,function(req, res){
    connection.query("select * from ch_carrier",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Carrier List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/carrierid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_carrier where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Carrier Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Carrier Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createcarrier', function(req, res){ 
	var carrier={
			"name":req.body.name,
			"last_date":req.body.last_date,
			"created_date":today,
			"modified_date":today
		}
		//console.log(meta);return;
		connection.query('INSERT INTO ch_carrier SET ?',carrier, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Carrier added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Carrier not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatecarrier', function(req, res){ 
	var carrier={
			"name":req.body.name,
			"last_date":req.body.last_date,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_carrier  SET ? where id =?',[carrier,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Carrier updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Carrier not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletecarrier', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_carrier  SET is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_carrier where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Carrier List updated Sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Carrier not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Carrier***************/////////////////
//////*************************Offer***************/////////////////
app.get('/offer' ,function(req, res){
    connection.query("select * from ch_offer",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Offer List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/offerid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_offer where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Offer Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Offer Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createoffer',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	var offer={
			"name":req.body.name,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"status" :1,
			"created_date":today,
			"modified_date":today
		}
		//console.log(offer);
		connection.query('INSERT INTO ch_offer SET ?',offer, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Offer added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Offer not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updateoffer',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	if(req.file ==undefined){
		var offer={
			"name":req.body.name,
			"description":req.body.description,
			"modified_date":today
		}
	}else{
		var offer={
			"name":req.body.name,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"modified_date":today
		}
	}
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_offer  SET ? where id =?',[offer,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Offer updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Offer not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deleteoffer', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_offer  SET 	is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_offer where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Offer List updated Sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Offer not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Offer***************/////////////////
//////*************************Testimonial***************/////////////////
app.get('/testimonial' ,function(req, res){
    connection.query("select * from ch_testimonials",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Testimonials List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/testimonialid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_testimonials where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Testimonials Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Testimonials Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createtestimonial',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	var testimonials={
			"name":req.body.name,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_testimonials SET ?',testimonials, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Testimonials added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Testimonials not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatetestimonial',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	if(req.file ==undefined){
		var testimonials={
			"name":req.body.name,
			"description":req.body.description,
			"modified_date":today
		}
	}else{
		var testimonials={
			"name":req.body.name,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"modified_date":today
		}
	}
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_testimonials  SET ? where id =?',[testimonials,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Testimonials updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Testimonials not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletetestimonial', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_testimonials  SET 	is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_testimonials where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Testimonials updated sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Testimonials not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Testimonial***************/////////////////
//////*************************Cms***************/////////////////
app.get('/cmsdata' ,function(req, res){
	var sql ="SELECT c.id,c.name,c.description,cn.name as cname FROM  ch_cms as c JOIN ch_cmsname as cn ON cn.id= c.cms_id";
    connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Cms List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.get('/cms' ,function(req, res){
	
    connection.query("select * from ch_cmsname",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"All Cms List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/Cmsid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_cms where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Cms Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Cms Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
}); 
app.post('/cmsnamedata' ,function(req, res){
	var cms_id= req.body.cms_id;
    connection.query("select * from ch_cms where cms_id = ?" ,[cms_id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Cms Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Cms Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createcms',function(req, res, next){ 
	//console.log(req);return;
	var cms={
			"name":req.body.name,
			"description":req.body.description,
			"cms_id":req.body.cms_id,
			"status" :1,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_cms SET ?',cms, function (error, result, fields) {
		//console.log(error);return;
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Cms added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Cms not added sucessfully"
				});
			}
		}
	});
});
app.post('/updatecms',function(req, res, next){ 
	//console.log(req.file);return;
	var cms={
			"name":req.body.name,
			"description":req.body.description,
			"cms_id":req.body.cms_id,
			"modified_date":today
		}
	
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_cms SET ? where id =?',[cms,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Cms updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Cms not updated sucessfully"
				});
			}
			
		}
	});
});
//////*************************Cms***************/////////////////
//*************************Social***************/////////////////
app.get('/social' ,function(req, res){
    connection.query("select * from ch_social",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Testimonials List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/socialid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_social where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Social Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Social Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createsocial',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	var testimonials={
			"name":req.body.name,
			"link":req.body.link,
			"image":req.file.filename,
			"img_path":req.file.path,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_social SET ?',testimonials, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Social added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Social not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updasocial',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	if(req.file ==undefined){
		var testimonials={
			"name":req.body.name,
			"link":req.body.link,
			"modified_date":today
		}
	}else{
		var testimonials={
			"name":req.body.name,
			"link":req.body.link,
			"image":req.file.filename,
			"img_path":req.file.path,
			"modified_date":today
		}
	}
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_social  SET ? where id =?',[testimonials,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Social updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Social not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletesocial', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_social  SET is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_social where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Social updated sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Social not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Social***************/////////////////
//*************************Faq***************/////////////////
app.post('/faqsearch' ,function(req, res){
	var search= req.body.value;
	//console.log(search);
	sql="SELECT * FROM ch_faq WHERE (name LIKE '%"+search+"%' OR description LIKE '%"+search+"%')";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Faq Data",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Faq Data",
				  "status":2,
				  "data":result
				});
			}
			//console.log(result);
        } 
    });
});
app.get('/faq' ,function(req, res){
    connection.query("select * from ch_faq where is_deleted = ?",0,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Testimonials List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/faqid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_faq where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Faq Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Faq Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createfaq',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	var testimonials={
			"name":req.body.name,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_faq SET ?',testimonials, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Faq added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Faq not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatefaq',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	if(req.file ==undefined){
		var testimonials={
			"name":req.body.name,
			"description":req.body.description,
			"modified_date":today
		}
	}else{
		var testimonials={
			"name":req.body.name,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"modified_date":today
		}
	}
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_faq  SET ? where id =?',[testimonials,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Faq updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Faq not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletefaq', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_faq  SET is_deleted='1' where id =?",[id], function (error, result, fields) {
		console.log(error);
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_faq where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Faq updated sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Faq not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Faq***************/////////////////
//////*************************Blog***************/////////////////
app.get('/blog' ,function(req, res){
    connection.query("select * from ch_blog",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Blog List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/blogid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_blog where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Blog Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Blog Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createblog',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	var blog={
			"title":req.body.title,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_blog SET ?',blog, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Blog added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Blog not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updateblog',upload.single('image'),function(req, res, next){ 
	//console.log(req.file);return;
	if(req.file ==undefined){
		var blog={
			"title":req.body.title,
			"description":req.body.description,
			"modified_date":today
		}
	}else{
		var blog={
			"title":req.body.title,
			"description":req.body.description,
			"image":req.file.filename,
			"img_path":req.file.path,
			"modified_date":today
		}
	}
	
		//console.log(slug);return;
		var id = req.body.id;
		connection.query('Update ch_blog  SET ? where id =?',[blog,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Blog updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Blog not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deleteblog', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_blog  SET 	is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_blog where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Blog updated sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Blog not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Blog***************/////////////////
//////*************************Category***************/////////////////
app.post('/category' ,function(req, res){
	var totalrecord= req.body.totalrecord;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	connection.query("select count(*) as rows from ch_category",function(error, results , fields){
	if(!!error){
		res.send({
			  "message":"Something Went wrong!",
			  "status":'3',
			});
		} else {
			var sql="select * from ch_category LIMIT "+pagecount+","+endcount+"";
			connection.query(sql,function(error, result , fields){
				if(!!error){
					res.send({
						  "message":"Something Went wrong!",
						  "status":error,
						});
				} else {
					var countrecord =results[0].rows;
					if(countrecord < 10){
						res.send({
						  "message":"Category Listing!",
						  "status":'1',
						  "data":result,
						  "record":'',
						});
					}else{
						res.send({
						  "message":"Category Listing!",
						  "status":'1',
						  "data":result,
						  "record":countrecord,
						});
					}
				} 
			});
		}
	});
});
app.post('/categoryid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_category where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Category Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Category Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createcategory', function(req, res){ 
	var category={
			"name":req.body.name,
			"status":1,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_category SET ?',category, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":error
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Category added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Category not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatecategory', function(req, res){ 
	var category={
			"name":req.body.name,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_category  SET ? where id =?',[category,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Category updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Category not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletecategory', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_category  SET 	is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_category where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						numRows = result.affectedRows;
						if(numRows > 0)
						{
							connection.query("select * from ch_category where is_deleted = ?",0,function(error, result , fields){
								if(!!error){
									res.send({
										  "message":"Something Went wrong!",
										  "status":'3',
										  "data":result
										});
								} else {
									res.send({
										  "message":"Category List updated Sucessfully",
										  "status":'1',
										  "data":result
										});
								} 
							});
						}
					} 
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Category not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Category***************/////////////////
//////*************************Sub Category***************/////////////////
app.post('/subcategory' ,function(req, res){
	var totalrecord= req.body.totalrecord;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	var sql ="SELECT sc.id,sc.name,c.name as catname FROM  ch_subcategory as sc JOIN ch_category as c ON c.id= sc.cat_id LIMIT "+pagecount+","+endcount+"";
    connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_subcategory";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Sub Category List!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Sub Category List!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result
				});
			}
        } 
    });
});
app.post('/subcategoryid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_subcategory where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Sub Category Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Sub Category Detail",
				  "status":2,
				  "data":result
				});
			}
			//console.log(result);
        } 
    });
});
app.post('/subcategorycatid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_subcategory where cat_id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Sub Category Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Sub Category Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createsubcategory', function(req, res){ 
	var subcategory={
			"name":req.body.name,
			"status":1,
			"cat_id":req.body.cat_id,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_subcategory SET ?',subcategory, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Sub Category added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Sub Category not added sucessfully"
				});
			}
		}
	});
});
app.post('/updatesubcategory', function(req, res){ 
	var subcategory={
			"name":req.body.name,
			"cat_id":req.body.cat_id,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_subcategory  SET ? where id =?',[subcategory,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Sub Category updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Sub Category not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletesubcategory', function(req, res){ 
		
		var id = req.body.id;
		connection.query("Update ch_subcategory  SET 	is_deleted='1' where id =?",[id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				connection.query("select * from ch_subcategory where is_deleted = ?",0,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Sub Category updated sucessfully",
							  "status":'1',
							  "data":result
							});
					} 
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Sub Category not deleted sucessfully"
				});
			}
			
		}
	});
});
//////*************************Category***************/////////////////
//////*************************Billing data***************/////////////////
app.post('/billingdata' ,function(req, res){
	var addedby= req.body.addedby;
	var billid= req.body.billid;
	var sql ="SELECT bp.id as ids,p.id as pids,p.batch_no,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity, p.perquantity,bp.loose FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id where bill_id='"+billid+"'";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				connection.query("select sum(totalprice) as tprice from ch_addtocart where bill_id='"+billid+"' and user_id='"+addedby+"'",function(error, total , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'2',
							  "data":error
							});
					} else {
						var tprice=total[0].tprice;
						var g=result[0].gst;
						//var gst=g/100*tprice;
						var gst=(tprice*100)/(100+12);
						
						var num = tprice-gst;
						var amount=num.toFixed(2);
						console.log(amount);
						res.send({
						  "message":"Billing Data List",
						  "status":'1',
						  "data":result,
						  "total":tprice,
						  "gst":gst,
						  "amount":amount
						});
					}
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Billing Data Detail",
				  "status":2,
				});
			}
        } 
    });
});
app.post('/viewbillingdata' ,function(req, res){
	var addedby= req.body.addedby;
	var id= req.body.id;
	var sql ="SELECT bp.id as ids,p.id as pids,p.batch_no,bp.product_id,p.name ,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity,b.id as billid,b.name as uname,b.email,b.mobile,b.address,p.perquantity,bp.loose FROM  ch_billing as b JOIN ch_billing_product_list as bp ON b.id= bp.billing_id JOIN ch_product as p ON p.id= bp.product_id  where b.addedby='"+addedby+"' and bill_no='"+id+"'";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":error
				});
        } else {
			numRows = result.length;
			console.log(result);
			if(numRows > 0)
			{
				var billnos= result[0].billid;
				console.log(billnos);
				connection.query("select sum(totalprice) as tprice from ch_billing_product_list where billing_id='"+billnos+"'",function(error, total , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'2',
							});
					} else {
						console.log(total);
						var tprice=total[0].tprice;
						var g=result[0].gst;
						//var gst=g/100*tprice;
						var gst=(tprice*100)/(100+12);
						var num = tprice-gst;
						var amount=num.toFixed(2);
						res.send({
						  "message":"Billing Data List",
						  "status":'1',
						  "data":result,
						  "total":tprice,
						  "gst":gst,
						  "amount":amount
						});
					}
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Billing Data Detail",
				  "status":2,
				});
			}
        } 
    });
});
app.post('/billingid' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_billing where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Billing Data Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Billing Data Detail",
				  "status":2,
				  "data":result
				});
			}
			console.log(result);
        } 
    });
});
app.post('/createbillingdata', function(req, res){ 
	var meta={
			"name":req.body.name,
			"title":req.body.title,
			"description":req.body.description,
			"status" : 1,
			"created_date":today,
			"modified_date":today
		}
		//console.log(meta);return;
		connection.query('INSERT INTO ch_billing SET ?',meta, function (error, result, fields) {
		if (error) {
			res.send({
			  "code":400,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Billing Data added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Billing Data not added sucessfully"
				});
			}
			
		}
	});
});
app.post('/updatebillingdata', function(req, res){ 
	var meta={
			"name":req.body.name,
			"title":req.body.title,
			"description":req.body.description,
			"status" : 1,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_billing  SET ? where id =?',[meta,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Billing Data updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Billing Data not updated sucessfully"
				});
			}
			
		}
	});
});
app.post('/deletebilling', function(req, res){ 
		
		var id = req.body.id;
		var addedby =req.body.addedby;
		var billid =req.body.billid;
		connection.query("DELETE FROM ch_addtocart where id =?",[id], function (error, results, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = results.affectedRows;
			if(numRows == 1)
			{
				var sql ="SELECT p.id,bp.id as ids,p.batch_no,bp.product_id,p.name,p.chemical_name,bp.price,bp.totalprice,bp.quantity,p.gst,p.perquantity,bp.loose,p.mrp FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id where bp.user_id='"+addedby+"' and bp.bill_id='"+billid+"'";
				connection.query(sql,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							  "data":result
							});
					} else {
						numRows = result.length;
						console.log(numRows);
						if(numRows > 0)
						{
							console.log(results);
							connection.query("select sum(totalprice) as tprice from ch_addtocart where user_id='"+addedby+"' and bill_id='"+billid+"'",function(error, total , fields){
								if(!!error){
									res.send({
										  "message":"Something Went wrong!",
										  "status":'2',
										});
								}else {
									var tprice=total[0].tprice;
									var g =result[0].gst;
									//var gst=g/100*tprice;
									var gst=(tprice*100)/(100+12);
									var num = tprice-gst;
									var amount=num.toFixed(2);
									res.send({
									  "message":"Billing Data updated sucessfully",
									  "status":'1',
									  "data":result,
									  "total":tprice,
									  "gst":gst,
									  "amount":amount
									});
								}
							});
						}else{
							res.send({
							  "message":"Billing Data updated sucessfully",
							  "status":'1',
							  "data":result,
							  "total":'',
							  "gst":'',
							  "amount":''
							});
						}
					} 
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Billing Data not deleted sucessfully"
				});
			}
			
		}
	});
});
app.post('/increquantity', function(req, res){ 
		var id = req.body.id;
		var product_id = req.body.product_id;
		var qua = req.body.quantity;
		var loose = req.body.loose;
		var salestype = req.body.salestype;
		var addedby = req.body.addedby;
		var userid =req.body.userid;
		var sql = "select quantity,mrp,pricepertablet,loose,perquantity FROM ch_product where id='"+product_id+"' and added_by='"+addedby+"'";
		connection.query(sql, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			console.log(result);
			var toquan = result[0].quantity;
			var toloose = result[0].loose;
			var mrpss = result[0].mrp;
			var pricepertablet = result[0].pricepertablet;
			var perquantity = result[0].perquantity;
			if(toquan > 0){
				var sql1 = "select * FROM ch_addtocart where id ='"+id+"' and user_id='"+addedby+"' and bill_id='"+userid+"'";
				connection.query(sql1, function (error, result, fields) {
					if (error) {
						res.send({
						  "status":3,
						  "failed":"Something went wrong!!"
						})
					}else{
						//console.log(perquantity)
						var quan = result[0].quantity;
						var dataloose = result[0].loose;
						var stype = result[0].salestype;
						var upquqn = qua*perquantity;
						//console.log(upquqn);
						var tupquqn = parseInt(upquqn)+parseInt(loose);
						//console.log(tupquqn);
						var utot = tupquqn*pricepertablet;
						var utot = utot.toFixed(2);
						//console.log(utot);
						var pgst = result[0].gst;
						if(stype == 1){
							var quantity={
								"quantity":qua,
								"loose":loose,
								"totalprice":utot,
								"gstamount":pgst/100*utot,
							}
						}else{
							var quantity={
								"quantity":qua,
								"loose":loose,
								"totalprice":utot,
								"gstamount":pgst/100*utot,
							}
						}
						connection.query('Update ch_addtocart  SET ? where id =?',[quantity,id], function (error, result, fields) {
							if (error) {
								res.send({
								  "status":3,
								  "failed":error
								})
							}else{
								numRows = result.affectedRows;
								if(numRows > 0)
								{
									var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity,p.perquantity,bp.loose FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id where user_id='"+addedby+"' and bill_id='"+userid+"'";
									connection.query(sql, function (error, result, fields) {
										//console.log(result); return;
										if (error) {
											res.send({
											  "status":3,
											  "failed":"Something went wrong!!"
											})
										}else{
											var sql2 ="select sum(totalprice) as tprice from ch_addtocart where user_id='"+addedby+"' and bill_id='"+userid+"'";
											connection.query(sql2,function(error, total , fields){
												if(!!error){
													res.send({
														  "message":"Something Went wrong!",
														  "status":'2',
														});
												} else {
													var tprice=total[0].tprice;
													var g=result[0].gst;
													//var gst=g/100*tprice;
													var gst=(tprice*100)/(100+12);
													var num = tprice-gst;
													var amount=num.toFixed(2);
													res.send({
													  "message":"Quantity updated sucessfully",
													  "status":'1',
													  "data":result,
													  "total":tprice,
													  "gst":gst,
													  "amount":amount
													});
												}
											});
										}
									});
								}else{
									res.send({
									  "status":2,
									  "message":"Quantity not updated sucessfully"
									});
								}
							}
						});
					}
				});
			}else{
				res.send({
				  "status":2,
				  "message":"We don't have enough quatity to add"
				});
			}
			
		}
	});
});
app.post('/addbilling', function(req, res){ 
	var id = req.body.id;
	var billid = req.body.billid;
	connection.query("select * FROM ch_addtocart where product_id =?",[id], function (error, result, fields)
	{
		if (error) 
		{
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else
		{
			var count = result.length;
			if(count > 0)
			{
				var sql ="SELECT p.id,p.name,p.image,p.rack_no,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id";
				connection.query(sql,function(error, result , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'2',
							  "data":result
							});
					} else {
						res.send({
							  "message":"Product Already Exits! We are not able to add this",
							  "status":2,
							  "data":result
							});
					} 
				});	
			}else{
				connection.query("select * FROM ch_product where id =?",[id], function (error, result, fields) 
				{
					if (error) {
						res.send({
						  "status":3,
						  "failed":"Something went wrong!!"
						})
					}else{
						var quan = result[0].quantity;
						if(quan > 0)
						{
							var actprice = result[0].selling_price;
							var addproduct={
								"quantity":1,
								"user_id":billid,
								"product_id":result[0].id,
								"price":actprice,
								"totalprice":1*actprice,
								"created_date":today,
							}
							connection.query('INSERT into ch_addtocart SET ?',addproduct, function (error, result, fields) 
							{
								if (error) {
									res.send({
									  "status":3,
									  "failed":"Something went wrong!!"
									})
								}else{
									numRows = result.affectedRows;
									if(numRows > 0)
									{
										var newquan=parseInt(quan)-1;
										var quantity={
											"quantity":newquan,
										}
										connection.query('Update ch_product  SET ? where id =?',[quantity,id], function (error, result, fields) {
											if (error) {
												res.send({
												  "status":3,
												  "failed":"Something went wrong!!"
												})
											}else{
												numRows = result.affectedRows;
												if(numRows > 0)
												{
													/*var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.rack_no,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid,sc.id as sid,sc.name as scname FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id JOIN ch_subcategory as sc ON p.subcat_id= sc.id ";
													connection.query(sql,function(error, result , fields){
														if(!!error){
															res.send({
																  "message":"Something Went wrong!",
																  "status":'2',
																  "data":result
																});
														} else {
															res.send({
																  "message":"Product added sucessfully",
																  "status":'1',
																  "data":result
																});
														} 
													});*/
													var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,bp.price,bp.totalprice,bp.quantity FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id";
													connection.query(sql,function(error, result , fields){
														if(!!error){
															res.send({
																  "message":"Something Went wrong!",
																  "status":'2',
																  "data":result
																});
														} else {
															numRows = result.length;
															if(numRows > 0)
															{
																connection.query("select sum(totalprice) as tprice from ch_addtocart",function(error, total , fields){
																	if(!!error){
																		res.send({
																			  "message":"Something Went wrong!",
																			  "status":'2',
																			  "data":result
																			});
																	} else {
																		var tprice=total[0].tprice;
																		var g=result[0].gst;
																		//var gst=g/100*tprice;
																		var gst=(tprice*100)/(100+12);
																		var num = tprice-gst;
																		var amount=num.toFixed(2);
																		res.send({
																		  "message":"Billing Data List",
																		  "status":'1',
																		  "data":result,
																		  "total":tprice,
																		  "gst":gst,
																		  "amount":amount
																		});
																	}
																});
															}else{
																res.send({
																  "code":200,
																  "message":"Billing Data Detail",
																  "status":2,
																  "data":result
																});
															}
														} 
													});
												}
											}
										});
									}else{
										res.send({
										  "status":2,
										  "message":"Product not added sucessfully"
										});
									}
								}
							});	
						}
						else{
							res.send({
							  "status":2,
							  "message":"Product can not be added sucessfully"
							});
						}
					}
				});
			}
		}	
	});
});
	
app.post('/detail', function(req, res){ 
		
		var userid = req.body.userid;
		var sql ="select Count(id) as count from ch_product where addedby='"+userid+"'";
		connection.query(sql, function (error, total, fields) {
			if (error) {
				res.send({
				  "status":3,
				  "failed":"Something went wrong!!"
				})
			}else{
				var total=total[0].count;
				var sql ="SELECT Count(id) as acount FROM ch_product where expire_date > CAST(CURRENT_TIMESTAMP AS DATE) and  available_date < CAST(CURRENT_TIMESTAMP AS DATE) where addedby='"+userid+"'";
				connection.query(sql, function (error, available, fields) {
				if(!!error){
					res.send({
						  "message":"Something Went wrong!",
						  "status":'3',
						});
				} else {
					var available=available[0].acount;
					connection.query("select sum(amount) as tprice from ch_billing_product_list ",function(error, price , fields){
						if(!!error){
							res.send({
								  "message":"Something Went wrong!",
								  "status":'3',
								});
						} else {
							var tprice=price[0].tprice;
							connection.query("select sum(amount) as month from ch_billing_product_list where selling_date < CAST(CURRENT_TIMESTAMP AS DATE)",function(error, month , fields){
								if(!!error){
									res.send({
										  "message":"Something Went wrong!",
										  "status":'3',
										});
								} else {
									var month=month[0].month;
									res.send({
									  "message":"Billing Data updated sucessfully",
									  "status":'1',
									  "total":total,
									  "available":available,
									  "price":tprice,
									  "month":month,
									});
								}
							});
						}
					});
				} 
			});	
		}
	});
});	
app.get('/nosale', function(req, res){ 
		
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id JOIN ch_selling as s ON p.id != s.product_id";
	connection.query(sql, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":2,
			  "failed":"Something went wrong!!"
			})
		}else{
			res.send({
			  "message":"No Sale Product",
			  "status":'1',
			  "data":result,
			});
		}
	});
});
app.get('/fastsale', function(req, res){ 
		
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id JOIN ch_selling as s ON p.id != s.product_id";
	connection.query(sql, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":2,
			  "failed":"Something went wrong!!"
			})
		}else{
			res.send({
			  "message":"No Sale Product",
			  "status":'1',
			  "data":result,
			});
		}
	});
});	
app.get('/slowsale', function(req, res){ 
		
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.expire_date,c.name as cname,c.id as cid FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id JOIN ch_selling as s ON p.id != s.product_id";
	connection.query(sql, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":2,
			  "failed":"Something went wrong!!"
			})
		}else{
			res.send({
			  "message":"No Sale Product",
			  "status":'1',
			  "data":result,
			});
		}
	});
});								
//////*************************Billing data***************/////////////////
//////*************************Wholesaler data***************/////////////////
app.post('/wholesaler' ,function(req, res){
	console.log(req.body);
    var addedby= req.body.addedby;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = 10;
	var sql ="SELECT id,name,email,mobile,address,gstno FROM ch_wholesaler where added_by='"+addedby+"' LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":error
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_wholesaler where added_by='"+addedby+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Wholesaler List",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Wholesaler List",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":''
				});
			}
        } 
    });
});
app.post('/wholesalerid' ,function(req, res){
	var id= req.body.id;
	var addedby= req.body.addedby;
    connection.query("select * from ch_wholesaler where id = ? and added_by =?" ,[id,addedby] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Wholesaler Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "message":"Wholesaler Detail",
				  "status":2,
				  "data":result
				});
			}
		} 
    });
}); 
app.post('/wholesalersearch' ,function(req, res){
	var search= req.body.value;
	var addedby= req.body.addedby;
	//sql="SELECT * FROM ch_product WHERE name LIKE '%"+search+"%'";
	sql="SELECT * FROM ch_wholesaler WHERE (name LIKE '%"+search+"%' OR email LIKE '%"+search+"%' or mobile LIKE '%"+search+"%' ) and added_by='"+addedby+"'";
    connection.query(sql,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "status":1,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Wholesaler Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "message":"Wholesaler Detail",
				  "status":2,
				  "data":result
				});
			}
		} 
    });
});
app.post('/createwholesaler',function(req, res, next){ 
	var wholesale={
			"name":req.body.name,
			"email":req.body.email,
			"mobile":req.body.mobile,
			"address":req.body.address,
			"gstno":req.body.gstno,
			"added_by":req.body.addedby,
			"created_date":today,
			"modified_date":today
		}
		connection.query('INSERT INTO ch_wholesaler SET ?',wholesale, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":2,
			  "failed":"error ocurred"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Wholesaler added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Wholesaler not added sucessfully"
				});
			}
		}
	});
});
app.post('/updatewholesaler',function(req, res, next){ 
	var wholesale={
			"name":req.body.name,
			"email":req.body.email,
			"mobile":req.body.mobile,
			"gstno":req.body.gstno,
			"address":req.body.address,
			"added_by":req.body.addedby,
			"modified_date":today
		}
		//console.log(wholesale);return;
		var id = req.body.id;
		//console.log(id);return;
		connection.query('Update ch_wholesaler  SET ? where id =?',[wholesale,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Wholesaler updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Wholesaler not updated sucessfully"
				});
			}
			
		}
	});
});
//////*************************Wholesaler data***************/////////////////
//////*************************Reorder data***************/////////////////
app.get('/orderproduct' ,function(req, res){
    
	var sql ="SELECT p.id,p.name,p.image,p.img_path,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.rack_no,p.expire_date,c.name as cname,c.id as cid,sc.id as sid,sc.name as scname FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id JOIN ch_subcategory as sc ON p.subcat_id= sc.id where quantity <= 10 and expire_date > CAST(CURRENT_TIMESTAMP AS DATE)";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			var sql ="SELECT * from ch_orderproduct";
			connection.query(sql,function(error, results , fields){
				if(!!error){
					res.send({
						  "message":"Something Went wrong!",
						  "status":'2',
						});
				} else {
					res.send({
					  "message":"Product List",
					  "status":'1',
					  "data":result,
					  "preor":results,
					});
				}
			});
        } 
    });
});
//////*************************Reorder data***************/////////////////
//////*************************Billing list data***************/////////////////
app.post('/billingproductlist',function(req, res, next){ 
	var addedby=req.body.addedby;
	var billno = req.body.billno;
	var sql ="select * from ch_addtocart where user_id='"+addedby+"' and bill_id='"+billno+"'";
	connection.query(sql, function (error, cartresult, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			var wholesale={
				"bill_no":billno,
				"name":req.body.name,
				"email":req.body.email,
				"mobile":req.body.mobile,
				"address":req.body.address,
				"addedby":addedby,
				"created_date":today,
				"modified_date":today
			}
			connection.query('Insert into ch_billing SET ?',[wholesale], function (error, results, fields) {
				if (error) {
					res.send({
					  "status":3,
					  "failed":"Something went wrong!!"
					})
				}else{
					var numRows = results.affectedRows;
					var billing_id =results.insertId;
					if(numRows > 0){
						cartresult.forEach(function(value, index, arr){
							var salestype =value.salestype;
							var price = value.price;
							var getquant = value.quantity;
							var getloose = value.loose;
							var totalprice = value.totalprice;
							var proid = value.product_id;
							var productlist={
								"billing_id":billing_id,
								"product_id":proid,
								"salestype":salestype,
								"price":price,
								"quantity":getquant,
								"loose":getloose,
								"totalprice":totalprice,
								"created_date":today,
								"modified_date":today
							}
							connection.query('Insert into ch_billing_product_list SET ?',[productlist], function (error, results, fields) {
								if (error) {
									res.send({
									  "status":3,
									  "failed":"Something went wrong!!"
									})
								}else{
									var numRows = results.affectedRows;
									if(numRows > 0){
										
										var sql ="SELECT quantity,perquantity,totalcount,loose FROM  ch_product where id = '"+proid+"'";
										connection.query(sql, function (error, prequ, fields) {
											if (error) {
												res.send({
												  "status":3,
												  "failed":"Something went wrong!!"
												})
											}else{
												var dataprqua = prequ[0].quantity;
												var dataperqua = prequ[0].perquantity;
												var datatotal = prequ[0].totalcount;
												var dataloose = prequ[0].loose;
												if(salestype == 1){
													
													var gettotals = (getquant*dataperqua);
													var gettotal = parseInt(gettotals)+parseInt(getloose);
													var actquqn = parseInt(datatotal)- parseInt(gettotal);
													//console.log(gettotals);
													//console.log(gettotal);
													//console.log(actquqn);
													var quotient = Math.floor(actquqn/dataperqua);
													var remainder = actquqn % dataperqua;
											
												}else if(salestype == 2){
													var gettotals = (getquant*dataperqua);
													var gettotal = parseInt(gettotals)+parseInt(getloose);
													var nqua = -gettotal;
													var actquqn = parseInt(prqua) + parseInt(nqua);
													var quotient = Math.floor(actquqn/dataperqua);
													var remainder = actquqn % dataperqua;
												}
												var proquantity = {
													"quantity":quotient,
													"loose":remainder,
													"totalcount":actquqn,
												}
												console.log(proquantity);
												connection.query('Update ch_product  SET ? where id =?',[proquantity,proid], function (error, result, fields) {
													if (error) {
														res.send({
														  "status":3,
														  "failed":"Something went wrong!!"
														})
													}else{
														var numRows = results.affectedRows;
														if(numRows > 0){
															var sqlit ="Delete FROM ch_addtocart where id='"+value.id+"'";
															connection.query(sqlit, function (error, result, fields) {
																if (error) {
																	res.send({
																	  "status":3,
																	  "failed":error
																	});
																}
															});
														}
													}
												});
											}
										});
											
									}
								}
							});
						});
						res.send({
						  "status":1,
						  "message":"Sucessfully Updated",
						  "lastinsertid":billing_id,
						});
					}else{
						res.send({
						  "status":1,
						  "message":error,
						  "lastinsertid":billing_id,
						});
					}
				}
			});
		}
	});
});
app.get('/wholesailer' ,function(req, res){
    
	var sql ="SELECT * from ch_wholesaler";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
            res.send({
				  "message":"Wholesaler List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/wholeDetail' ,function(req, res){
	var id= req.body.id;
    connection.query("select * from ch_wholesaler where id = ?" ,[id] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "code":200,
				  "message":"Whosaler Detail",
				  "status":1,
				  "data":result[0]
				});
			}else{
				res.send({
				  "code":200,
				  "message":"Whosaler Detail",
				  "status":2,
				});
			}
			//console.log(result);
        } 
    });
});
app.post('/autoorder', function(req, res){ 
	var id = req.body.id;
	var added_by = req.body.added_by;
	connection.query("select * FROM ch_orderproduct where product_id =?",[id], function (error, result, fields)
	{
		if (error) 
		{
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else
		{
			var count = result.length;
			//console.log(count);return false;
			if(count == 0)
			{
				var sql ="SELECT id,name,batch_no,company_name FROM ch_product where id ='"+id+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'2',
							  "data":result
							});
					} else {
						var name = results[0].name;
						var batch_no = results[0].batch_no;
						var company_name	 = results[0].company_name	;
						var orderproduct={
							"quantity":1,
							"product_id":results[0].id,
							"name":name,
							"batch_no":batch_no,
							"company_name":company_name,
							"created_date":today,
							"modified_date":today,
							"added_by":added_by
						}
						connection.query('INSERT into ch_orderproduct SET ?',orderproduct, function (error, result, fields) 
						{
							if (error) {
								res.send({
								  "status":3,
								  "failed":"Something went wrong!!"
								})
							}else{
								var sql ="SELECT * FROM ch_orderproduct";
								connection.query(sql,function(error, ress , fields){
									if(!!error){
										res.send({
											  "message":"Something Went wrong!",
											  "status":'2',
											  "data":result
											});
									} else {
										numRows = ress.length;
										if(numRows > 0)
										{
											res.send({
											  "status":1,
											  "data":ress,
											  "message":"Billing Data List",
											})
										}
									}
								});
							}
						});
					} 
				});
			}else{
				res.send({
					  "message":"Product Already Exits! We are not able to add this",
					  "status":2,
					  "data":result
					});
			}
		}
	});
});
app.post('/increquantityorder', function(req, res){ 
	var id = req.body.id;
	var product_id = req.body.product_id;
	connection.query("select * FROM ch_orderproduct where product_id =?",[product_id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			var quan = result[0].quantity;
			var newquan=parseInt(quan)+1;
			var quantity={
				"quantity":newquan,
			}
			connection.query('Update ch_orderproduct  SET ? where id =?',[quantity,id], function (error, result, fields) {
				if (error) {
					res.send({
					  "status":3,
					  "failed":"Something went wrong!!"
					})
				}else{
					var sql ="SELECT * FROM ch_orderproduct";
					connection.query(sql,function(error, ress , fields){
						if(!!error){
							res.send({
								  "message":"Something Went wrong!",
								  "status":'2',
								  "data":result
								});
						} else {
							numRows = ress.length;
							if(numRows > 0)
							{
								res.send({
								  "status":1,
								  "data":ress,
								  "message":"Billing Data List",
								})
							}
						}
					});
				}
			});
		}
	});
});
app.post('/discrequantityorder', function(req, res){ 
	var id = req.body.id;
	var product_id = req.body.product_id;
	connection.query("select * FROM ch_orderproduct where product_id =?",[product_id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			var quan = result[0].quantity;
			if(quan == 1){
				res.send({
					  "status":2,
					  "message":"Order quantity cannot be deleted",
					})
			}else{
				var newquan=parseInt(quan)-1;
				var quantity={
					"quantity":newquan,
				}
				connection.query('Update ch_orderproduct  SET ? where id =?',[quantity,id], function (error, result, fields) {
					if (error) {
						res.send({
						  "status":3,
						  "failed":"Something went wrong!!"
						})
					}else{
						var sql ="SELECT * FROM ch_orderproduct";
						connection.query(sql,function(error, ress , fields){
							if(!!error){
								res.send({
									  "message":"Something Went wrong!",
									  "status":'2',
									  "data":result
									});
							} else {
								numRows = ress.length;
								if(numRows > 0)
								{
									res.send({
									  "status":1,
									  "data":ress,
									  "message":"Order Data List",
									})
								}
							}
						});
					}
				});
			}
		}
	});
});
app.get('/csvupload' ,function(req, res){ 
	let stream = fs.createReadStream("bezkoder.csv");
	let csvData = [];
	let csvStream = fastcsv
	.parse()
	.on("data", function(data) {
		csvData.push(data);
	})
	.on("end", function() {
		// remove the first line: header
		csvData.shift();

		// create a new connection to the database
		const connection = mysql.createConnection({
		  host: "localhost",
		  user: "root",
		  password: "",
		  database: "hiring"
		});

		// open the connection
		connection.connect(error => {
		  if (error) {
			console.error(error);
		  } else {
			  
				let query ="INSERT INTO cat (id, name, description, created_at) VALUES ?";
					connection.query(query, [csvData], (error, response) => {
					//console.log(error || response);
					if(error) {
					  res.send({
						  "message":"Not sucessfully Inserted",
						  "status":2,
						  "Error":error,
						});
					} else {
						res.send({
						  "message":"Sucessfully Inserted",
						  "status":1,
						});
					}
					
				});
			}
		});
	});
	stream.pipe(csvStream);
});
app.get('/excel',function(req,res){
    
	const styles = {
		headerDark: {
		},
	};
	connection.query("select * from ch_users",function(err,rows){
	const heading = [
	  [{value: 'Customer Info', style: styles.headerDark}],
	];
	const specification = {
		sno: { 
			displayName: 'S.No', 
			headerStyle: styles.headerDark, 
			width: 40 ,
		},
		name: { 
			displayName: 'Name', 
			headerStyle: styles.headerDark, 
			width: 120 
		},
		email: { 
			displayName: 'Email', 
			headerStyle: styles.headerDark, 
			width: 120 
		},
		mobile: {
			displayName: 'Mobile',
			headerStyle: styles.headerDark,
			width: 120,
		}
	}
	var dataset = [];
	for(i=0;i<rows.length;i++){
		fname=rows[i].fname;
		lname=rows[i].lname;
		email=rows[i].email;
		mobile=rows[i].mobile;
		var a = {sno:i+1,name: fname + ' ' + lname, email: email, mobile: mobile, misc: 'not shown'};
		dataset.push(a);
	}
	const merges = [
		{ start: { row: 1, column: 1 }, end: { row: 1, column: 4 } },
	]
	 
	const report = excel.buildExport(
		[ 
			{
			  name: 'Customer', 
			  heading: heading, 
			  merges: merges, 
			  specification: specification, 
			  data: dataset
			}
		]
	);
	res.attachment('customer.xlsx'); 
	return res.send(report);
	});
});
app.post('/getexcel',function(req,res){
    
	var id= req.body.id;
	var added_by= req.body.added_by;
	const styles = {
		headerDark: {
		},
	};
	var sql ="SELECT YEAR(created_date) AS `year`, MONTHNAME(created_date) AS `month`, SUM( totalprice) AS `subtotal`, count(*) AS total FROM ch_billing_product_list WHERE created_date BETWEEN '2019-01-01' AND '2019-12-01' GROUP BY YEAR(created_date), MONTH(created_date) and billing_id='"+id+"'";
	connection.query(sql,function(err,rows){
	const heading = [
	  [{value: 'Customer Info', style: styles.headerDark}],
	];
	const specification = {
		sno: { 
			displayName: 'S.No', 
			headerStyle: styles.headerDark, 
			width: 40 ,
		},
		Year: { 
			displayName: 'Year', 
			headerStyle: styles.headerDark, 
			width: 120 
		},
		Month: { 
			displayName: 'Month', 
			headerStyle: styles.headerDark, 
			width: 120 
		},
		Subtotal: {
			displayName: 'Subtotal',
			headerStyle: styles.headerDark,
			width: 120,
		},
		total: {
			displayName: 'Total',
			headerStyle: styles.headerDark,
			width: 120,
		}
	}
	var dataset = [];
	for(i=0;i<rows.length;i++){
		year=rows[i].year;
		month=rows[i].month;
		subtotal=rows[i].subtotal;
		total=rows[i].total;
		var a = {sno:i+1,year: year, month: month, subtotal: subtotal, total: total};
		dataset.push(a);
	}
	const merges = [
		{ start: { row: 1, column: 1 }, end: { row: 1, column: 4 } },
	]
	 
	const report = excel.buildExport(
		[ 
			{
			  name: 'Customer', 
			  heading: heading, 
			  merges: merges, 
			  specification: specification, 
			  data: dataset
			}
		]
	);
	res.attachment('customer.xlsx'); 
	return res.send(report);
	});
});
app.get('/excelss',function(req,res){
    
	const styles = {
		headerDark: {
			fill: {
				fgColor: {
					rgb: 'FFFFFFFF'
				}
				
			},
			font: {
				color: {
					rgb: 'FF000000'
				},
				sz: 10,
				bold: true,
			}
		},
	};
	connection.query("select * from ch_users",function(err,rows){
	const heading = [
	  [{value: 'User Info', style: styles.headerDark}],
	];
	const specification = {
		sno: { 
			displayName: 'S.No', 
			headerStyle: styles.headerDark, 
			width: 40 ,
		},
		name: { 
			displayName: 'Name', 
			headerStyle: styles.headerDark, 
			width: 120 
		},
		email: { 
			displayName: 'Email', 
			headerStyle: styles.headerDark, 
			width: 120 
		},
		mobile: {
			displayName: 'Mobile',
			headerStyle: styles.headerDark,
			width: 120,
		}
	}
	var dataset = [];
	for(i=0;i<rows.length;i++){
		fname=rows[i].fname;
		lname=rows[i].lname;
		email=rows[i].email;
		mobile=rows[i].mobile;
		var a = {sno:i+1,name: fname + ' ' + lname, email: email, mobile: mobile, misc: 'not shown'};
		dataset.push(a);
	}
	const merges = [
		{ start: { row: 1, column: 1 }, end: { row: 1, column: 4 } },
	]
	 
	const report = excel.buildExport(
		[ 
			{
			  name: 'Report', 
			  heading: heading, 
			  //merges: merges, 
			  specification: specification, 
			  data: dataset
			}
		]
	);
	res.attachment('report.xlsx'); 
	return res.send(report);
	});
});
//////*************************Vendor Bill data***************/////////////////
app.post('/vendorbill' ,function(req, res){
    var addedby= req.body.addedby;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = 10;
	var sql ="SELECT vb.id,vb.bill_no,vb.bill_date,vb.amount,vn.name,vb.paid,vb.pending_amount from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.addedby='"+addedby+"'  LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'3',
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_vendor_bill where addedby='"+addedby+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":error,
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Vendor Bill List",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Vendor Bill List",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result
				});
			}
        } 
    });
});

app.post('/vendorbillid' ,function(req, res){
	var id= req.body.id;
	var addedby= req.body.addedby;
    connection.query("select vb.*,vn.name from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.id = ? and vb.addedby =?" ,[id,addedby] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":2,
				  "data":result
				});
			}
		} 
    });
}); 
app.post('/vendorbillsearch' ,function(req, res){
	var search= req.body.value;
	var addedby= req.body.addedby;
	sql="SELECT vb.*,vn.name from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id WHERE (vb.bill_no LIKE '%"+search+"%' or vn.name LIKE '%"+search+"%' ) and vb.addedby='"+addedby+"'";
    connection.query(sql,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "status":1,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":2,
				  "data":result
				});
			}
		} 
    });
});
app.post('/createvendorbill',function(req, res, next){ 
	var addedby =req.body.addedby;
	var vendorbill={
			"vendor_id":req.body.vendor_id,
			"bill_no":req.body.bill_no,
			"bill_date":today,
			"amount":req.body.amount,
			"pending_amount":req.body.amount,
			"addedby":addedby,
			"updatedby":addedby,
			"created_date":today,
			"modified_date":today,
		}
		connection.query('INSERT INTO ch_vendor_bill SET ?',vendorbill, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":2,
			  "failed":error
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				var vendor_id =result.insertId;
				var sql ="select * from ch_vendor_product_t where added_by='"+addedby+"' ";
				connection.query(sql, function (error, prdata, fields) {
					if (error) {
						res.send({
						  "status":2,
						  "failed":error
						})
					}else{
						numRows = prdata.length;
						if(numRows > 0)
						{
							prdata.forEach(function(value, index, arr){
								var addbillproduct = {
									'vendor_bill_id' :vendor_id,
									'cat_id' :value.cat_id,
									'subcat_id' :value.subcat_id,
									'name' :value.name,
									'image' :'',
									'img_path' :'',
									'chemical_name' :value.chemical_name,
									'mrp' :value.mrp,
									'selling_price' :value.selling_price,
									'available_price' :value.available_price,
									'hsn_code' :value.hsn_code,
									'gst' :value.gst,
									'company_name' :value.company_name,
									'quantity' :value.quantity,
									'perquantity' :value.perquantity,
									'totalcount' : value.totalcount,
									'rack_no' :value.rack_no,
									'batch_no' :value.batch_no,
									'barcode' :value.barcode,
									'is_prescription' :value.is_prescription,
									'expire_date' :value.expire_date,
									'available_date' :today,
									'created_date' :value.created_date,
									'modified_date' :value.modified_date,
									'added_by' :value.added_by,
								}
								connection.query('INSERT into ch_vendor_product SET ?',addbillproduct, function (error, resultadd, fields) 
								{
									if (error) {
										res.send({
										  "status":3,
										  "failed":error
										})
									}else{
										var sql ="Delete from ch_vendor_product_t where id='"+value.id+"'";
										connection.query(sql, function (error, resultadd, fields) 
										{
											if (error) {
												res.send({
												  "status":3,
												  "failed":error
												})
											}else{
												
											}
										});
									}
								});
							});
							res.send({
							  "status":1,
							  "message":"Vendor Bill added sucessfully",
							  "lastinsertid":vendor_id,
							});
						}
					}
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Vendor Bill not added sucessfully"
				});
			}
		}
	});
});
app.post('/updatevendorbill',function(req, res, next){ 
	var vendorbill={
			"vendor_id":req.body.vendor_id,
			"bill_no":req.body.bill_no,
			"bill_date":req.body.bill_date,
			"amount":req.body.amount,
			"updatedby":req.body.addedby,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_vendor_bill  SET ? where id =?',[vendorbill,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Vendor Bill updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Vendor Bill not updated sucessfully"
				});
			}
			
		}
	});
});
//////*************************Vendor Bill data***************/////////////////
//////*************************Vendor Payment data***************/////////////////
app.post('/vendorpayment' ,function(req, res){
    var addedby= req.body.addedby;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = 10;
	//var sql ="SELECT vb.id,vn.name,vb.bill_no,vb.amount from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.addedby='"+addedby+"' LIMIT "+pagecount+","+endcount+"";
	//var sql ="SELECT vb.id,vb.vendor_id,vn.name,sum(vb.pending_amount) as totalamount from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.addedby='"+addedby+"' and vb.paid !='paid' GROUP BY vendor_id LIMIT "+pagecount+","+endcount+"";
	var sql ="SELECT vb.vendor_id,vn.name,sum(vb.pending_amount) as totalamount from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.addedby='"+addedby+"' and vb.paid !='paid' GROUP BY vendor_id LIMIT "+pagecount+","+endcount+"";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":error,
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_vendor_bill where addedby='"+addedby+"' and paid !='paid'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":error,
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Vendor Bill List!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Vendor Bill List!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result
				});
			}
        } 
    });
});

app.post('/vendorpaymentid' ,function(req, res){
	var id= req.body.id;
	var addedby= req.body.addedby;
    connection.query("select vb.*,vn.name from ch_vendor_pay as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.id = ? and vb.addedby =?" ,[id,addedby] ,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":2,
				  "data":result
				});
			}
		} 
    });
}); 
app.post('/vendorpaymentsearch' ,function(req, res){
	var search= req.body.value;
	var addedby= req.body.addedby;
	sql="SELECT vb.*,vn.name from ch_vendor_pay as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id WHERE (vb.bill_id LIKE '%"+search+"%' or vn.name LIKE '%"+search+"%' or vb.amount LIKE '%"+search+"%' ) and vb.addedby='"+addedby+"'";
    connection.query(sql,function(error, result , fields){
        if(!!error){
            console.log('error in query ');
			res.send({
				  "status":1,
				  "message":error
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":1,
				  "data":result
				});
			}else{
				res.send({
				  "message":"Vendor Bill Detail",
				  "status":2,
				  "data":result
				});
			}
		} 
    });
});
app.post('/createvendorpayment',function(req, res, next){ 
	var vendorid = req.body.vendor_id;
	var billid = req.body.bill_id;
	var total_billing_amount = req.body.pendingamount;
	var payamount = req.body.paidamount;
	var addedby = req.body.addedby;
	//console.log(billid);
	var advance_amount =0;
	var bill_pending_amount = 0;
	
	if(total_billing_amount >= payamount)
	{
		bill_pending_amount = parseInt(total_billing_amount) - parseInt(payamount);
	}
	else{
		advance_amount = parseInt(payamount) - parseInt(total_billing_amount);
	}
	
	
		var vendorbill={
			"vendor_id":vendorid,
			"bill_id":billid.toString(),
			"payment_date":today,
			"billing_amount":total_billing_amount,
			"paid_amount":payamount,
			"pending_amount":bill_pending_amount,
			"advance_amount":advance_amount,
			"mode":req.body.mode,
			"addedby":addedby,
			"created_date":today,
			"modified_date":today,
			"updatedby":addedby
		}
		connection.query('INSERT INTO ch_vendor_pay SET ?',vendorbill, function (error, result, fields) {
		if (error) {
			res.send({
			  "status":2,
			  "failed":error
			})
		}else{
			numRows = result.affectedRows;
			//var payid =result.insertId;
			if(numRows > 0)
			{
				var sqla = "select * from ch_vendor_bill where bill_no in ("+billid.toString()+")";
				connection.query(sqla, function (error, rsamount, fields) {
					if (error) {
						res.send({
						  "status":3,
						  "failed":error
						})
					}else{
						var paidamount =payamount;
						
						// use function here


							getData(rsamount,paidamount,payamount).then(data => {
								console.log('promise return ', data);
								res.send({
								  "status":1,
								  "message":"Vendor Bill added sucessfully",
								  "data":data
								});
							})
							.catch(function(error){
								res.send({
								  "status":1,
								  "message":"Vendor Bill added sucessfully"
								});
							})
							
						
						/*res.send({
						  "status":1,
						  "message":"Vendor Bill added sucessfully"
						});*/
					}
				});
			}else{
				res.send({
				  "status":2,
				  "message":"Vendor Bill not added sucessfully"
				});
			}
		}
	});
});
app.post('/updatevendorpayment',function(req, res, next){ 
	var vendorid = req.body.vendor_id;	
	var vendorbill={
			"vendor_id":vendorid,
			"bill_id":req.body.bill_id.toString(),
			"payment_date":req.body.payment_date,
			"amount":req.body.amount,
			"mode":req.body.mode,
			"updatedby":req.body.addedby,
			"modified_date":today
		}
		var id = req.body.id;
		connection.query('Update ch_vendor_pay  SET ? where id =?',[vendorbill,id], function (error, result, fields) {
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			numRows = result.affectedRows;
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Vendor Bill updated sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Vendor Bill not updated sucessfully"
				});
			}
			
		}
	});
});
//////*************************Vendor Payment data***************/////////////////
app.post('/getcustomerreport' ,function(req, res){
	var added_by= req.body.added_by;
	var totalrecord= req.body.totalrecord;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	var sql ="SELECT b.id,b.name,b.email,b.mobile,b.address,sum(pb.totalprice) as totalpur FROM   ch_billing as b JOIN ch_billing_product_list as pb ON b.id= pb.billing_id  where addedby ='"+added_by+"' GROUP BY billing_id LIMIT "+pagecount+","+endcount+" ";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":error,
				 });
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				var sql ="SELECT count(*) as rows FROM  ch_billing as b JOIN ch_billing_product_list as pb ON b.id= pb.billing_id  where addedby ='"+added_by+"' GROUP BY billing_id ";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Product Detail!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Product Detail!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
						
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result,
				});
			}
		} 
    });
});
app.post('/salesearch' ,function(req, res){
	var search= req.body.value;
	var addedby= req.body.addedby;
	var sql ="SELECT sum(pb.totalprice) as totalpur,b.* FROM   ch_billing as b JOIN ch_billing_product_list as pb ON b.id= pb.billing_id where addedby ='"+addedby+"' and (b.name LIKE '%"+search+"%' OR b.email LIKE '%"+search+"%' or b.address LIKE '%"+search+"%' or b.mobile LIKE '%"+search+"%' or pb.price LIKE '%"+search+"%') GROUP BY billing_id ";
	connection.query(sql,function(error, result , fields){
        
		if(!!error){
            console.log('error in query ');
			res.send({
				  "code":400,
				  "message":"Error in Query"
				});
        } else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Product Detail",
				  "status":1,
				  "data":result,
				  "record":''
				});
			}else{
				res.send({
				  "message":"Product Detail",
				  "status":1,
				  "data":result,
				  "record":''
				});
			}
			//console.log(result);
        } 
    });
});
app.post('/getpurchasereport' ,function(req, res){
	var addedby= req.body.addedby;
	var id= req.body.id;
	var totalrecord= req.body.totalrecord;
	var end= req.body.enddate;
	var pagevalue= req.body.pagevalue;
	var pagecount = pagevalue *10;
	var endcount = totalrecord;
	//var sql ="SELECT YEAR(created_date) AS `year`, MONTHNAME(created_date) AS `month`, SUM( totalprice) AS `subtotal`, count(*) AS total FROM ch_billing_product_list WHERE created_date BETWEEN '2019-04-01' AND '2020-03-31' and billing_id='"+id+"' GROUP BY YEAR(created_date), MONTH(created_date) ";
	var sql ="SELECT  *, totalprice as  total FROM ch_billing_product_list WHERE created_date BETWEEN '2019-04-01' AND '2020-03-31' and billing_id='"+id+"' ";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":error,
				 });
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				//var sql ="SELECT count(*) as rows FROM ch_billing_product_list WHERE created_date BETWEEN '2019-04-01' AND '2020-03-31' and billing_id='"+id+"' GROUP BY YEAR(created_date), MONTH(created_date)";
				var sql ="SELECT count(*) as rows FROM ch_billing_product_list WHERE created_date BETWEEN '2019-04-01' AND '2020-03-31' and billing_id='"+id+"'";
				connection.query(sql,function(error, results , fields){
					if(!!error){
						res.send({
							  "message":"Something Went wrong!",
							  "status":'3',
							});
					} else {
						var countrecord =results[0].rows;
						if(countrecord < 10){
							res.send({
							  "message":"Purchase Report!!",
							  "status":'1',
							  "data":result,
							  "record":'',
							});
						}else{
							res.send({
							  "message":"Purchase report!!",
							  "status":'1',
							  "data":result,
							  "record":countrecord,
							});
						}
					}
				});
			}else{
				res.send({
				  "message":"No data found",
				  "status":'2',
				  "data":result,
				});
			}
		} 
    });
});
app.get('/hsn' ,function(req, res){
    connection.query("select * from ch_hsn",function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				});
        } else {
            res.send({
				  "message":"Hsn Data List",
				  "status":'1',
				  "data":result
				});
        } 
    });
});
app.post('/productsearchss' ,function(req, res){
	var search= req.body.value;
	var salestype= req.body.salestype;
	var slength =search.length;
	var addedby= req.body.addedby;
	var billid= req.body.billid;
	if(salestype == 1){
		
		var sql="SELECT p.id,p.selling_price,p.mrp,p.gst FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id  WHERE ( p.name LIKE '%"+search+"%' OR p.chemical_name LIKE '%"+search+"%' or p.company_name LIKE '%"+search+"%' or p.rack_no LIKE '%"+search+"%' or p.batch_no LIKE '%"+search+"%' or p.barcode LIKE '"+search+"') and p.added_by='"+addedby+"'";
		connection.query(sql,function(error, result , fields){
			if(!!error){
				res.send({
					  "status":3,
					  "message":"Error in Query"
					});
			} else {
				numRows = result.length;
				if(numRows > 0)
				{
					var id = result[0].id;
					connection.query("select * FROM ch_addtocart where product_id ='"+id+"' and bill_id='"+billid+"' and user_id='"+addedby+"'", function (error, addresult, fields)
					{
						if (error) 
						{
							res.send({
							  "status":3,
							  "failed":error
							})
						}else
						{
							var numRow = addresult.length;
							if(numRow <= 0)
							{
								var actprice = result[0].mrp;
								var pgst = result[0].gst;
								var addproduct = {
												"quantity":1,
												"loose":0,
												"user_id":addedby,
												"bill_id":billid,
												"product_id":result[0].id,
												"price":actprice,
												"totalprice":1*actprice,
												"gst":pgst,
												"gstamount":pgst/100*actprice,
												"created_date":today,
												"mrp":result[0].mrp,
												"salestype":salestype,
											}
								connection.query('INSERT into ch_addtocart SET ?',addproduct, function (error, resultadd, fields) 
								{
									if (error) {
										res.send({
										  "status":3,
										  "failed":error
										})
									}else{
										numRowsadd = resultadd.affectedRows;
										if(numRowsadd > 0)
										{
											var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity,bp.loose,p.perquantity FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id where bp.bill_id='"+billid+"' and bp.user_id='"+addedby+"'";
											connection.query(sql,function(error, getresult , fields){
												if(!!error){
													res.send({
														  "message":"Something Went wrong!",
														  "status":'2',
														  "data":error
														});
												} else {
													numRowsget = getresult.length;
													if(numRowsget > 0)
													{
														connection.query("select sum(totalprice) as tprice from ch_addtocart where bill_id='"+billid+"' and user_id='"+addedby+"'",function(error, total , fields){
															if(!!error){
																res.send({
																	  "message":"Something Went wrong!",
																	  "status":'2',
																	   "data":error
																	});
															} else {
																
																var tprice=total[0].tprice;
																var g=result[0].gst;
																//var gst=g/100*tprice;
																var gst=(tprice*100)/(100+12);
																var num = tprice-gst;
																var amount=num.toFixed(2);

																res.send({
																  "message":"Product Added sucessfully",
																  "status":'1',
																  "data":getresult,
																  "total":tprice,
																  "gst":gst,
																  "amount":amount,
																});
															}
														});
													}else{
														res.send({
														  "code":200,
														  "message":"Billing Data Detail",
														  "status":2,
														});
													}
												} 
											});
										}
									}
								});
							}
							else{
								res.send({
								  "message":"Product already Exit",
								  "status":'2',
								  "data":'',
								  "total":'',
								  "gst":'',
								  "amount":'',
								});
							}
						}	
					});
					
				}else{
					var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity,p.perquantity,bp.loose FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id where bp.bill_id='"+billid+"' and bp.user_id='"+addedby+"'";
					connection.query(sql,function(error, getresult , fields){
						if(!!error){
							res.send({
								  "message":"Something Went wrong!",
								  "status":'2',
								  "data":error
								});
						} else {
							numRowsget = getresult.length;
							if(numRowsget > 0)
							{
								connection.query("select sum(totalprice) as tprice from ch_addtocart where bill_id='"+billid+"' and user_id='"+addedby+"'",function(error, total , fields){
									if(!!error){
										res.send({
											  "message":"Something Went wrong!",
											  "status":'2',
											});
									} else {

										var tprice=total[0].tprice;
										var g=getresult[0].gst;
										//var gst=g/100*tprice;
										var gst=(tprice*100)/(100+12);
										var num = tprice-gst;
										var amount=num.toFixed(2);
										res.send({
										  "message":"Product not Found",
										  "status":'2',
										  "data":getresult,
										  "total":tprice,
										  "gst":gst,
										  "amount":amount,
										});
									}
								});
							}else{
								res.send({
								  "message":"Product Not found",
								  "status":2,
								  "data":"",
								  "total":"",
								  "gst":"",
								  "amount":"",
								});
							}
						} 
					});
				}
			} 
		});
	}else{
		
		var sql="SELECT p.id,p.selling_price,p.mrp,p.gst FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id  WHERE ( p.name LIKE '%"+search+"%' OR p.chemical_name LIKE '%"+search+"%' or p.company_name LIKE '%"+search+"%' or p.rack_no LIKE '%"+search+"%' or p.	batch_no LIKE '%"+search+"%' or p.barcode LIKE '"+search+"') and p.added_by='"+addedby+"'";
		connection.query(sql,function(error, result , fields){
			if(!!error){
				res.send({
					  "status":3,
					  "message":error
					});
			} else {
				numRows = result.length;
				if(numRows > 0)
				{
					var id = result[0].id;
					connection.query("select * FROM ch_addtocart where product_id ='"+id+"' and bill_id='"+billid+"' and user_id='"+addedby+"'", function (error, addresult, fields)
					{
						if (error) 
						{
							res.send({
							  "status":3,
							  "failed":error
							})
						}else
						{
							var numRow = addresult.length;
							if(numRow <= 0)
							{
								var actprice = result[0].mrp;
								console.log(actprice);
								var addproduct = {
												"quantity":-1,
												"loose":0,
												"user_id":addedby,
												"bill_id":billid,
												"product_id":result[0].id,
												"price":actprice,
												"totalprice":-1*actprice,
												"created_date":today,
												"mrp":result[0].mrp,
												"salestype":salestype,
											}
								console.log(addproduct);
								connection.query('INSERT into ch_addtocart SET ?',addproduct, function (error, resultadd, fields) 
								{
									if (error) {
										res.send({
										  "status":3,
										  "failed":error,
										})
									}else{
										numRowsadd = resultadd.affectedRows;
										if(numRowsadd > 0)
										{
											var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity,p.perquantity,bp.loose FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id where bill_id='"+billid+"' and user_id='"+addedby+"'";
											connection.query(sql,function(error, getresult , fields){
												if(!!error){
													res.send({
														  "message":"Something Went wrong!",
														  "status":'2',
														  "data":error
														});
												} else {
													numRowsget = getresult.length;
													if(numRowsget > 0)
													{
														connection.query("select sum(totalprice) as tprice from ch_addtocart where bill_id='"+billid+"' and user_id='"+addedby+"'",function(error, total , fields){
															if(!!error){
																res.send({
																	  "message":"Something Went wrong!",
																	  "status":'2',
																	   "data":error
																	});
															} else {

																var tprice=total[0].tprice;
																var g=result[0].gst;
																//var gst=g/100*tprice;
																var gst=(tprice*100)/(100+12);
																var num = tprice-gst;
																var amount=num.toFixed(2);
																res.send({
																  "message":"Product Added sucessfully",
																  "status":'1',
																  "data":getresult,
																  "total":tprice,
																  "gst":gst,
																  "amount":amount,
																});
															}
														});
													}else{
														res.send({
														  "code":200,
														  "message":"Billing Data Detail",
														  "status":2,
														});
													}
												} 
											});
										}
									}
								});
							}
							else{
								res.send({
								  "message":"Product already Exit",
								  "status":'2',
								  "data":'',
								  "total":'',
								  "gst":'',
								  "amount":'',
								});
							}
						}	
					});
					
				}else{
					var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity,p.perquantity,bp.loose FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id ";
					connection.query(sql,function(error, getresult , fields){
						if(!!error){
							res.send({
								  "message":"Something Went wrong!",
								  "status":'2',
								  "data":error
								});
						} else {
							numRowsget = getresult.length;
							if(numRowsget > 0)
							{
								connection.query("select sum(totalprice) as tprice from ch_addtocart",function(error, total , fields){
									if(!!error){
										res.send({
											  "message":"Something Went wrong!",
											  "status":'2',
											});
									} else {

										var tprice=total[0].tprice;
										var g=result[0].gst;
										//var gst=g/100*tprice;
										var gst=(tprice*100)/(100+12);
										var num = tprice-gst;
										var amount=num.toFixed(2);
										res.send({
										  "message":"Product not Found",
										  "status":'2',
										  "data":getresult,
										  "total":tprice,
										  "gst":gst,
										  "amount":amount,
										});
									}
								});
							}else{
								res.send({
								  "message":"Product Not found",
								  "status":2,
								  "data":"",
								  "total":"",
								  "gst":"",
								  "amount":"",
								});
							}
						} 
					});
				}
			} 
		});
	}
});
app.post('/addtocart' ,function(req, res){
	var id= req.body.id;
	var actprice = req.body.selling_price;
	var mrp = req.body.mrp;
	var user_id = req.body.user_id;
	var addproduct = {
						"quantity":1,
						"product_id":id,
						"user_id":user_id,
						"price":actprice,
						"totalprice":1*actprice,
						"mrp":mrp,
						"created_date":today,
					}
	connection.query("select * FROM ch_addtocart where product_id =?",[id], function (error, addresult, fields)
	{
		if (error) 
		{
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else
		{
			var numRow = addresult.length;
			if(numRow <= 0)
			{
				connection.query('INSERT into ch_addtocart SET ?',addproduct, function (error, resultadd, fields) 
				{
					if (error) {
						res.send({
						  "status":3,
						  "failed":"Something went wrong!!"
						})
					}else{
						numRowsadd = resultadd.affectedRows;
						if(numRowsadd > 0)
						{
							var sql ="SELECT p.id,bp.id as ids,bp.product_id,p.name,p.chemical_name,p.gst,p.mrp,p.Selling_price,bp.price,bp.totalprice,bp.quantity FROM  ch_addtocart as bp JOIN ch_product as p ON p.id= bp.product_id";
							connection.query(sql,function(error, getresult , fields){
								if(!!error){
									res.send({
										  "message":"Something Went wrong!",
										  "status":'2',
										  "data":error
										});
								} else {
									numRowsget = getresult.length;
									if(numRowsget > 0)
									{
										connection.query("select sum(totalprice) as tprice from ch_addtocart",function(error, total , fields){
											if(!!error){
												res.send({
													  "message":"Something Went wrong!",
													  "status":'2',
													   "data":error
													});
											} else {

												var tprice=total[0].tprice;
												var g=result[0].gst;
												//var gst=g/100*tprice;
												var gst=(tprice*100)/(100+12);
												var num = tprice-gst;
												var amount=num.toFixed(2);
												res.send({
												  "message":"Product Added sucessfully",
												  "status":'1',
												  "data":getresult,
												  "total":tprice,
												  "gst":gst,
												  "amount":amount,
												});
											}
										});
									}else{
										res.send({
										  "message":"Billing Data Detail",
										  "status":2,
										});
									}
								} 
							});
						}
					}
				});
			}
			else{
				res.send({
				  "message":"Product already Exit",
				  "status":'2',
				  "data":'',
				  "total":'',
				  "gst":'',
				  "amount":'',
				});
			}
		}	
	});
});
app.post('/getgst' ,function(req, res){
    var hsncode =req.body.hsn;
	var sql ="SELECT * from ch_hsn where id='"+hsncode+"'";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":result
				});
        } else {
			
			res.send({
			  "message":"Gst Value",
			  "status":'1',
			  "data":result[0].gst,
			});
			
        } 
    });
});
app.post('/getbills' ,function(req, res){
	var vendorid = req.body.vendorid;
	var sql ="SELECT id,bill_no,amount FROM ch_vendor_bill where vendor_id='"+vendorid+"' and paid='Unpaid'";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":error
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				res.send({
					  "message":"Wholesaler List",
					  "status":'1',
					  "data":result,
					});
			}else{
				res.send({
				  "message":"Wholesaler List",
				  "status":'1',
				  "data":result,
				});
			}
        } 
    });
});
app.post('/billno' ,function(req, res){
	var addedby= req.body.addedby;
	var addbill = {
		'user_id' :addedby,
	}
	connection.query('INSERT into ch_bill_no SET ?',addbill, function (error, resultadd, fields) 
	{
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			var bill_id =resultadd.insertId;
			res.send({
			  "message":"bill Id",
			  "status":'1',
			  "data":bill_id,
			});
	}
	});
});
app.post('/deleteproduct' ,function(req, res){
	var addedby= req.body.addedby;
	var productid= req.body.productid;
	var bill_id= req.body.billid;
	var sql = "select * FROM ch_vendor_product WHERE added_by='"+addedby+"' and id='"+productid+"' and vendor_bill_id='"+bill_id+"'";
	connection.query(sql, function (error, proquant, fields) 
	{
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			var Numrows =proquant.length;
			if(Numrows > 0){
				var pname = proquant[0].name;
				var catid = proquant[0].cat_id;
				var barcode = proquant[0].barcode;
				var subcatid = proquant[0].subcat_id;
				var chemicalname = proquant[0].chemical_name;
				
				var sql ="select * from ch_product where cat_id ='"+catid+"' and subcat_id='"+subcatid+"' and name='"+pname+"' and chemical_name='"+chemicalname+"' and barcode='"+barcode+"' and added_by='"+addedby+"'";
				connection.query(sql, function (error, productal, fields) 
				{
					if (error) {
						res.send({
						  "status":3,
						  "failed":"Something went wrong!!"
						})
					}else{
						console.log(productal);
						var Numrows =productal.length;
						console.log(productal);
						var lastqua = productal[0].quantity;
						var quan   = proquant[0].quantity;
						var newqua = parseInt(lastqua) - parseInt(quan);
						if(Numrows > 0){
							var sql ="update ch_product SET quantity='"+newqua+"' where name='"+pname+"' and chemical_name='"+chemicalname+"' and barcode='"+barcode+"' and added_by='"+addedby+"'";
							connection.query(sql, function (error, finalres, fields) 
							{
								if (error) {
									res.send({
									  "status":3,
									  "failed":error
									})
								}else{
									var sql = "DELETE FROM ch_vendor_product WHERE added_by='"+addedby+"' and id='"+productid+"' and vendor_bill_id='"+bill_id+"'";
									connection.query(sql, function (error, pdelete, fields) 
									{
										if (error) {
											res.send({
											  "status":3,
											  "failed":"Something went wrong!!"
											})
										}else{
											var Numrows =pdelete.affectedRows;
											if(Numrows > 0){
												var sql ="SELECT p.id as sno,p.vendor_bill_id as vid,p.name,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.rack_no,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_vendor_product as p JOIN ch_category as c ON p.cat_id= c.id where vendor_bill_id ='"+bill_id+"' and added_by='"+addedby+"'";
												connection.query(sql, function (error, billdata, fields) 
												{
													if (error) {
														res.send({
														  "status":3,
														  "failed":"Something went wrong!!"
														})
													}else{
														var Numrows =billdata.length;
														if(Numrows > 0){
															res.send({
															  "message":"Product Deleted Sucessfully!!",
															  "status":'1',
															  "data":billdata,
															});
														}else{
															res.send({
															  "message":"Product Deleted Sucessfully!!",
															  "status":'1',
															  "data":billdata,
															});
														}
													}
												});
											} else{
												var sql ="SELECT p.id as sno,p.vendor_bill_id as vid,p.name,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.rack_no,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_vendor_product as p JOIN ch_category as c ON p.cat_id= c.id where vendor_bill_id ='"+bill_id+"' and added_by='"+addedby+"'";
												connection.query(sql, function (error, billdata, fields) 
												{
													if (error) {
														res.send({
														  "status":3,
														  "failed":"Something went wrong!!"
														})
													}else{
														var Numrows =billdata.length;
														if(Numrows > 0){
															res.send({
															  "message":"Product Deleted Sucessfully!!",
															  "status":'1',
															  "data":billdata,
															});
														}else{
															res.send({
															  "message":"Product Not Deleted Sucessfully!!",
															  "status":'5',
															  "data":'',
															});
														}
													}
												});	
											}
										}
									});
								}
							});
						}else{
							res.send({
							  "message":"Product Not Deleted Sucessfully!!",
							  "status":'3',
							  "data":'',
							});	
						}
					}
				});
			}else{
				res.send({
					  "message":"Product Not Deleted Sucessfully!!",
					  "status":'4',
					  "data":'',
					});
			}
		
		}
	});
});
app.post('/getbillproduct' ,function(req, res){
	var addedby= req.body.addedby;
	var bill_id= req.body.billid;
	var sql ="SELECT p.id as sno,p.vendor_bill_id as vid,p.name,p.chemical_name,p.mrp,p.selling_price,p.available_price,p.company_name,p.quantity,p.rack_no,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_vendor_product as p JOIN ch_category as c ON p.cat_id= c.id where vendor_bill_id ='"+bill_id+"' and added_by='"+addedby+"'";
	//var sql ="select * from ch_vendor_product where vendor_bill_id ='"+bill_id+"' and added_by='"+addedby+"'";
	connection.query(sql, function (error, billdata, fields) 
	{
		if (error) {
			res.send({
			  "status":3,
			  "failed":"Something went wrong!!"
			})
		}else{
			var Numrows =billdata.length;
			if(Numrows > 0){
				res.send({
				  "message":"Bill Product!!",
				  "status":'1',
				  "data":billdata,
				});
			}else{
				res.send({
				  "message":"Bill Product!!",
				  "status":'1',
				  "data":'',
				});
			}
		}
	});
});
app.post('/createvendorproduct' ,function(req, res){
	var addedby= req.body.addedby;
	var productid= req.body.productid;
	var purchaseprice= req.body.purchaseprice;
	var mrp= req.body.mrp;
	var quantity= req.body.quantity;
	var expiredate= req.body.expiredate;
	var batchno= req.body.batchno;
	var sql ="Select * from ch_product where id='"+productid+"' and added_by ='"+addedby+"'";
	connection.query(sql, function (error, selectprodata, fields) 
	{
		if (error) {
			res.send({
			  "status":3,
			  "failed":error
			})
		}else{
			var Numrows =selectprodata.length;
			if(Numrows > 0){
				var addbillproduct = {
					'cat_id' :selectprodata[0].cat_id,
					//'subcat_id' :selectprodata[0].subcat_id,
					'name' :selectprodata[0].name,
					'image' :'',
					'img_path' :'',
					'chemical_name' :selectprodata[0].chemical_name,
					'mrp' :mrp,
					'selling_price' :mrp,
					'available_price' :	purchaseprice,
					'total_price' :	purchaseprice*quantity,
					'hsn_code' :selectprodata[0].hsn_code,
					'gst' :selectprodata[0].gst,
					'company_name' :selectprodata[0].company_name,
					'quantity' :quantity,
					'perquantity' :selectprodata[0].perquantity,
					'totalcount' : selectprodata[0].totalcount,
					'rack_no' :selectprodata[0].rack_no,
					'batch_no' :batchno,
					'barcode' :selectprodata[0].barcode,
					'is_prescription' :selectprodata[0].is_prescription,
					'expire_date' :expiredate,
					'available_date' :today,
					'created_date' :today,
					'modified_date' :today,
					'added_by' :addedby,
				}
				connection.query('INSERT into ch_vendor_product_t SET ?',addbillproduct, function (error, resultadd, fields) 
				{
					if (error) {
						res.send({
						  "status":3,
						  "failed":error
						})
					}else{
						var Numrows =resultadd.affectedRows;
						if(Numrows > 0){
							var sql ="select *  from ch_vendor_product_t  where added_by='"+addedby+"'";
							connection.query(sql, function (error, result, fields) 
							{
								if (error) {
									res.send({
									  "status":3,
									  "failed":error
									})
								}else{
									var sql ="select sum(total_price) as amount from ch_vendor_product_t  where added_by='"+addedby+"'";
									connection.query(sql, function (error, resultsum, fields) 
									{
										if (error) {
											res.send({
											  "status":3,
											  "failed":error
											})
										}else{
											//console.log(result);
											res.send({
											  "message":"Product Added Sucessfully",
											  "status":'1',
											  "data":result,
											  "amount":resultsum[0].amount
											})
										}
									
									});
								}
							});
							
						}else{
							res.send({
							  "message":"Product Not Added Sucessfully",
							  "status":'2',
							  "data":'',
							  "amount":''
							});
							
						}
					}
				});
			}else{
				res.send({
				  "message":"Product Not Added Sucessfully",
				  "status":'2',
				  "data":'',
				  "amount":''
				});	
			}
		}
	});
});
app.post('/updatebillproduct' ,function(req, res){
	var addedby= req.body.addedby;
	var productid= req.body.productid;
	var billid= req.body.billid;
	var purchaseprice= req.body.purchaseprice;
	var mrp= req.body.mrp;
	var quantity= req.body.quantity;
	var expiredate= req.body.expiredate;
	var batchno= req.body.batchno;
	var sql ="Select * from ch_product where id ='"+productid+"' and added_by='"+addedby+"'";
	connection.query(sql, function (error, prdata, fields) 
	{
		if (error) {
			res.send({
			  "status":3,
			  "failed":error
			})
		}else{
			numRows = prdata.length;
			if(numRows > 0)
			{
					var addbillproduct = {
						'vendor_bill_id' :billid,
						'cat_id' :prdata[0].cat_id,
						//'subcat_id' :prdata[0].subcat_id,
						'name' :prdata[0].name,
						'image' :'',
						'img_path' :'',
						'chemical_name' :prdata[0].chemical_name,
						'mrp' :mrp,
						'selling_price' :prdata[0].selling_price,
						'available_price' :purchaseprice,
						'hsn_code' :prdata[0].hsn_code,
						'gst' :prdata[0].gst,
						'company_name' :prdata[0].company_name,
						'quantity' :quantity,
						'perquantity' :prdata[0].perquantity,
						'totalcount' : prdata[0].totalcount,
						'rack_no' :prdata[0].rack_no,
						'batch_no' :batchno,
						'barcode' :prdata[0].barcode,
						'is_prescription' :prdata[0].is_prescription,
						'expire_date' :expiredate,
						'available_date' :today,
						'created_date' :prdata[0].created_date,
						'modified_date' :prdata[0].modified_date,
						'added_by' :addedby,
					}
					connection.query('INSERT into ch_vendor_product SET ?',addbillproduct, function (error, resultadd, fields) 
					{
						if (error) {
							res.send({
							  "status":3,
							  "failed":error
							})
						}else{
							var Numrows =resultadd.affectedRows;
							if(numRows > 0)
							{
								var lastqua = prdata[0].quantity;
								var newqua = parseInt(lastqua) + parseInt(quantity);
								var sql ="update ch_product SET quantity='"+newqua+"' ,available_price='"+purchaseprice+"', expire_date='"+expiredate+"',mrp='"+mrp+"',batch_no='"+batchno+"' where id='"+productid+"' and added_by='"+addedby+"'";
								connection.query(sql, function (error, finalres, fields) 
								{
									if (error) {
										res.send({
										  "status":3,
										  "failed":error
										})
									}else{
										
										var sql ="Select * from ch_vendor_bill where id='"+billid+"' and addedby='"+addedby+"'";
										connection.query(sql, function (error, billiddata, fields) 
										{
											if (error) {
												res.send({
												  "status":3,
												  "failed":"Something went wrong!!"
												})
											}else{
												console.log(billiddata);
												var tamount =  parseInt(billiddata[0].amount)+ parseInt(quantity*purchaseprice);
												var pendamount = parseInt(billiddata[0].pending_amount)+ parseInt(quantity*purchaseprice);
												var sql ="update ch_vendor_bill SET amount='"+tamount+"' ,pending_amount='"+pendamount+"' where id='"+billid+"' and addedby='"+addedby+"'";
												connection.query(sql, function (error, billdata, fields) 
												{
													if (error) {
														res.send({
														  "status":3,
														  "failed":"Something went wrong!!"
														})
													}else{
														var sql ="SELECT p.id as sno,p.vendor_bill_id as vid,p.name,p.chemical_name,p.mrp,p.selling_price,p.company_name,p.quantity,p.available_price,p.rack_no,p.expire_date,c.name as cname,p.gst,p.hsn_code,p.batch_no FROM ch_vendor_product as p JOIN ch_category as c ON p.cat_id= c.id  where vendor_bill_id ='"+billid+"' and added_by='"+addedby+"'";
														connection.query(sql, function (error, billdata, fields) 
														{
															if (error) {
																res.send({
																  "status":3,
																  "failed":"Something went wrong!!"
																})
															}else{
																var Numrows =billdata.length;
																console.log(billdata);
																if(Numrows > 0){
																	res.send({
																	  "message":"Bill Product!!",
																	  "status":'1',
																	  "data":billdata,
																	});
																}else{
																	res.send({
																	  "message":"Bill Product!!",
																	  "status":'1',
																	  "data":'',
																	});
																}
															}
														});
													}
												});
											}
										});
									}
								});
							}
							
						}
					});
			}
		}
	});
});
app.post('/addvendorproductlist' ,function(req, res){
	var searchproduct = req.body.productsearch;
	var slength =searchproduct.length;
	var addedby= req.body.addedby;
	var billid= req.body.billid;
	var sql="SELECT p.*,c.name as cname,p.hsn_code as hcode FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id WHERE ( p.name LIKE '"+searchproduct+"' or p.barcode LIKE '"+searchproduct+"') and p.added_by='"+addedby+"'";
	connection.query(sql,function(error, result , fields){
		if(!!error){
			res.send({
				  "status":3,
				  "message":error
				});
		} else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Product Detail",
				  "status":'1',
				  "data":result[0],
				  "billid":billid,
				});
			}else{
				res.send({
				  "message":"Product Detail",
				  "status":'2',
				  "data":result[0],
				  "billid":billid,
				});
			}	
		} 
	});
});
app.post('/addvendorproduct' ,function(req, res){
	var searchproduct = req.body.productsearch;
	var slength =searchproduct.length;
	var addedby= req.body.addedby;
	var sql="SELECT p.*,c.name as cname,p.hsn_code as hcode FROM ch_product as p JOIN ch_category as c ON p.cat_id= c.id  WHERE ( p.name LIKE '"+searchproduct+"') and p.added_by='"+addedby+"'";
	connection.query(sql,function(error, result , fields){
		if(!!error){
			res.send({
				  "status":3,
				  "message":error
				});
		} else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Product Detail",
				  "status":'1',
				  "data":result[0],
				});
			}else{
				res.send({
				  "message":"Product Detail",
				  "status":'2',
				  "data":result[0],
				});
			}	
		} 
	});
});
app.post('/nonpaidvendorbill' ,function(req, res){
	var vendorid =req.body.vendorid;
	var addedby= req.body.addedby;
	var sql="SELECT * from ch_vendor_bill where paid !='Paid' and vendor_id='"+vendorid+"' and addedby='"+addedby+"'";
	connection.query(sql,function(error, result , fields){
		if(!!error){
			res.send({
				  "status":3,
				  "message":error
				});
		} else {
			numRows = result.length;
			if(numRows > 0)
			{
				res.send({
				  "message":"Product Detail",
				  "status":'1',
				  "data":result,
				});
			}else{
				res.send({
				  "message":"Product Detail",
				  "status":'2',
				  "data":result,
				});
			}	
		} 
	});
});
app.post('/allvendorbill' ,function(req, res){
	var vendorid = req.body.vendorid;
	var addedby = req.body.addedby;
	var sql ="SELECT vb.*,vn.name from ch_vendor_bill as vb JOIN ch_wholesaler as vn ON vn.id= vb.vendor_id where vb.addedby='"+addedby+"' and  vendor_id='"+vendorid+"'";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":error
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				res.send({
					  "message":"Wholesaler List",
					  "status":'1',
					  "data":result,
					});
			}else{
				res.send({
				  "message":"Wholesaler List",
				  "status":'1',
				  "data":result,
				});
			}
        } 
    });
});
app.post('/emptyvendorbill' ,function(req, res){
	var addedby = req.body.addedby;
	var sql ="Delete from ch_vendor_product_t where added_by='"+addedby+"'";
	connection.query(sql,function(error, result , fields){
        if(!!error){
            res.send({
				  "message":"Something Went wrong!",
				  "status":'2',
				  "data":error
				});
        } else {
			var Numrows =result.length;
			if(Numrows > 0){
				res.send({
					  "message":"Bill List",
					  "status":'1',
					});
			}else{
				res.send({
				  "message":"Bill List",
				  "status":'2',
				});
			}
        } 
    });
});
//////*************************Billing List data***************/////////////////
app.get('/userout',function(req,res){ 
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
		res.send({
		  "message":"User Logout",
		  "status":1,
		});
    }
  });
});


// get data

	const getData =  async function(rsamount,paidamount,payamount) {
		
		var promiseArray = [];
		if(rsamount[0])
		{
			var pending = 0;
			rsamount.forEach(function(value, index, arr){
				//console.log(value);			
				if(paidamount == value.pending_amount){
					
					var toamount = parseInt(paidamount)+parseInt(value.paid_amount);
					var sqla = "Update ch_vendor_bill  set  pending_amount='"+pending+"' , paid_amount='"+toamount+"' , paid='Paid' where id ='"+value.id+"'";
					paidamount = 0;
					
				}else if(paidamount > value.pending_amount){
					
					var toamount = parseInt(value.pending_amount)+parseInt(value.paid_amount);
					var sqla = "Update ch_vendor_bill  set  pending_amount='"+pending+"' , paid_amount='"+toamount+"' , paid='Paid' where id ='"+value.id+"'";
					paidamount = parseInt(paidamount) - parseInt( value.amount);
					
				}else{
					var toamount = parseInt(paidamount)+parseInt(value.paid_amount);
					pending = parseInt(value.pending_amount) - parseInt( paidamount);
					var sqla = "Update ch_vendor_bill  set  pending_amount='"+pending+"' , paid_amount='"+toamount+"' , paid='ParPaid' where id ='"+value.id+"'";
					
				}
				
				promiseArray.push(
					 new Promise((resolve, reject) =>
						connection.query(sqla, function (error, rsamount, fields) {
							if (error) {
								resolve( index );
							}else{
								resolve(sqla);
							}
						})
					)
				);
				
				
			});
						
			
		}

		return await  Promise.all(promiseArray);

	}



/*connection.query(sqla, function (error, rsamount, fields) {
							if (error) {
								resolve( {amount : 0 });
							}else{
								console.log('sddasdsd');
							resolve( {amount : parseInt(value.amount) - parseInt(paidamount) });
								
							}
						});*/
app.get('/imexcels',function(req,res){
	const xlsxFile = require('read-excel-file/node');
	var product = [];
	xlsxFile('./Stock.xlsx').then((rows) => {
	//for marg data
	/*rows.forEach((value)=>{
			  //console.log(value[0]);
			  product.push({cat_id:value[2],subcat_id:'',name:value[1],image:'',img_path:'',chemical_name:'',mrp:value[9],selling_price:value[9],available_price:'',gst:12,hsn_code:value[0],company_name:value[12],quantity:value[3],perquantity:'',totalcount:'',rack_no:'',batch_no:'',barcode:'',is_prescription:2,expire_date:'2020-6-11',available_date:'',created_date:today,modified_date:today,added_by:10});
			  
			  
	})*/
	//for redbook
	rows.forEach((value)=>{
			console.log(value);
			 var exdate =value[6];
			 var tcount =value[2] * 1;
			  product.push({cat_id:value[3],subcat_id:'',name:value[0],image:'',img_path:'',chemical_name:'',mrp:value[10],selling_price:value[10],available_price:'',gst:value[8],hsn_code:value[1],company_name:value[11],quantity:value[2],perquantity:1,totalcount:tcount,rack_no:'',batch_no:value[4],barcode:value[15],is_prescription:2,expire_date:exdate,available_date:'',created_date:today,modified_date:today,added_by:11});
			  
			  
	})
		//console.log(product);
		connection.query(
			'INSERT INTO ch_product (cat_id, name, mrp,hsn_code,company_name,quantity,perquantity,batch_no,barcode,is_prescription,expire_date,created_date,modified_date,added_by) VALUES ?',
			[product.map(item => [item.cat_id, item.name, item.mrp, item.hsn_code, item.company_name,item.quantity,item.perquantity,item.batch_no,item.barcode,item.is_prescription,item.expire_date,item.created_date,item.modified_date,item.added_by])],
			(error, result) => {
				if (error) {
			console.log(error);
			res.send({
			  "code":400,
			  "failed":error
			})
		}else{
			numRows = result.affectedRows;
			console.log(numRows);
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Product added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Product not added sucessfully"
				});
			}
			
		}
			}
		);
		/*connection.query('INSERT INTO ch_product SET ?',product, function (error, result, fields) {
		if (error) {
			console.log(error);
			res.send({
			  "code":400,
			  "failed":error
			})
		}else{
			numRows = result.affectedRows;
			console.log(numRows);
			if(numRows > 0)
			{
				res.send({
				  "status":1,
				  "message":"Product added sucessfully"
				});	
			}else{
				res.send({
				  "status":2,
				  "message":"Product not added sucessfully"
				});
			}
			
		}
	});*/
		// console.table(rows);
	})
	
});
app.get('/imexcel',function(req,res){
	var Excel = require('exceljs');

	var wb = new Excel.Workbook();
	var path = require('path');
	var filePath = path.resolve(__dirname,'sample.xlsx');

	wb.xlsx.readFile(filePath).then(function(){

		var sh = wb.getWorksheet("Sheet1");

		sh.getRow(1).getCell(2).value = 32;
		wb.xlsx.writeFile("sample2.xlsx");
		console.log("Row-3 | Cell-2 - "+sh.getRow(3).getCell(2).value);

		console.log(sh.rowCount);
		//Get all the rows data [1st and 2nd column]
		for (i = 1; i <= sh.rowCount; i++) {
			console.log(sh.getRow(i).getCell(1).value);
			console.log(sh.getRow(i).getCell(2).value);
		}
	});
});
app.listen(8086);