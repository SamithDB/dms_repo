// app/routes.js
	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
	var math = require('mathjs');
		
	connection.query('USE ' + dbconfig.database);


module.exports = function(app, passport) {

	// =====================================
	// Dashboard ===========================
	// =====================================

	app.get('/dmsdash', function(req, res) {
		

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);

			        			var query = connection.query('SELECT * FROM employee',function(err3,rowlist){
				        		if(err3)
				        			console.log(err3);

				        			var query = connection.query('SELECT * FROM login',function(err4,usrlist){
				        			if(err3)
				        				console.log(err4);

				        			var query = connection.query('SELECT * FROM department',function(err4,deplist){
				        			if(err4)
				        				console.log(err4);

				        			var query = connection.query('SELECT * FROM store',function(err5,storelist){
				        			if(err5)
				        				console.log(err5);

				        			var query = connection.query('SELECT * FROM dmslevel',function(err5,dmslevellist){
				        			if(err5)
				        				console.log(err5);

				        			if(req.user.level=="admin"){
				        				res.render('dms_dashboard.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevellist
										});
				        			}else{
				        				res.redirect('/dmshome');
				        			}

				        			});

				        			});
				        				
				        			});

			        			  	});
				        			
			        			});
                   
        	});


	});

	

	// =====================================
	// =====================================
	//  Usr add to DMS

	app.post('/settodms', function(req, res, next) {

		
			var newdmsusr = new Object();
			newdmsusr.usrid = req.body.usrid;
			newdmsusr.level = req.body.dmslevel;
			newdmsusr.status = "B";


			var insertQuery = "INSERT INTO dmslevel (dmslevel.login_idlogin, dmslevel.level, dmslevel.status) values (?,?,?)";
			connection.query(insertQuery,[newdmsusr.usrid, newdmsusr.level, newdmsusr.status],function(err, rows) {
			 if (err){
				 console.log(err);
			 }else{
			 	console.log("Done!");
			 }

			
			res.redirect('/dmsdash'); 

			});
		

	});

	// =====================================
	// =====================================
	//  Usr dms Level update

	app.post('/dmslvl', function(req, res, next) {

		
			var dmsusr = new Object();
			dmsusr.usrid = req.body.usrid;
			dmsusr.level = req.body.dmslevel;

			var insertQuery = "UPDATE dmslevel SET dmslevel.level = ? WHERE dmslevel.login_idlogin = ?";
			connection.query(insertQuery,[ dmsusr.level, dmsusr.usrid ],function(err, rows) {
				 if (err) {
					console.log(err);
				} else {
					console.log('Changed!');
					res.redirect('/dmsdash'); 
				}
			})
		

	});

	// =====================================
	// =====================================
	//  Usr dms Revork

	app.post('/dmsrevk', function(req, res, next) {

		
			var dmsusr = new Object();
			dmsusr.usrid = req.body.usrid;
			dmsusr.status = "A";

			var insertQuery = "UPDATE dmslevel SET dmslevel.status = ? WHERE dmslevel.login_idlogin = ?";
			connection.query(insertQuery,[ dmsusr.status, dmsusr.usrid ],function(err, rows) {
				 if (err) {
					console.log(err);
				} else {
					console.log('Changed!');
					res.redirect('/dmsdash'); 
				}
			})
		

	});

	// =====================================
	// =====================================
	//  dms Grant for revoke usrs

	app.post('/dmsgrnt', function(req, res, next) {

		
			var dmsusr = new Object();
			dmsusr.usrid = req.body.usrid;
			dmsusr.status = "B";

			var insertQuery = "UPDATE dmslevel SET dmslevel.status = ? WHERE dmslevel.login_idlogin = ?";
			connection.query(insertQuery,[ dmsusr.status, dmsusr.usrid ],function(err, rows) {
				 if (err) {
					console.log(err);
				} else {
					console.log('Changed!');
					res.redirect('/dmsdash'); 
				}
			})
		

	});





	
}


// route middleware to make sure
function isLoggedIn(req, res, next) {


		// if user is authenticated in the session, carry on
		if (req.isAuthenticated()){
			return next();
		}

		// if they aren't redirect them to the home page
		res.redirect('/');
}
