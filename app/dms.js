// app/routes.js
	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
		
	connection.query('USE ' + dbconfig.database);
	
	module.exports = function(app, passport) {

		// ====================================
		// DMS Home ===========================
		// ====================================

		app.get('/dmshome', function(req, res) {
		

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

				        				res.render('dms_home.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level
										});

				        	});
				        				
				        });

			        });
				        			
			    });
                   
        	});


		});
		
		app.get('/dms', (req, res) => {
		
			opn(this.authorizeUrl, { wait: false });
		
		});
		
		'use strict';

		// [START main_body]
		const google = require('googleapis');
		const express = require('express');
		const opn = require('opn');
		const path = require('path');
		const fs = require('fs');


		const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

		// Create an oAuth2 client to authorize the API call
		const client = new google.auth.OAuth2(
		  '230517522799-27ng1ovvthmq1hnfhrtqsjoqpt0pdk32.apps.googleusercontent.com',
		  'c7YPB0E9JwwAY35POsSN72BT',
		  'http://localhost:8080/listfiles'
		);

		// Generate the url that will be used for authorization
		this.authorizeUrl = client.generateAuthUrl({
		  access_type: 'offline',
		  scope: scopes
		});

		// Open an http server to accept the oauth callback. In this
		// simple example, the only request to our webserver is to
		// /oauth2callback?code=<code>
		app.get('/listfiles', (req, res) => {
		  const code = req.query.code;
		  client.getToken(code, (err, tokens) => {
			if (err) {
			  console.error('Error getting oAuth tokens:');
			  throw err;
			}
			client.credentials = tokens;
			res.send('Authentication successful! Please return to the console.');
			//listFiles(client);
			
			const service = google.drive('v3');
			service.files.list({
			auth: client,
			pageSize: 100,
			fields: 'nextPageToken, files(id, name)'
		  }, (err, res) => {
			if (err) {
			  console.error('The API returned an error.');
			  throw err;
			}
			const files = res.data.files;
			if (files.length === 0) {
			  console.log('No files found.');
			} else {
				
			  console.log('Files Found!');
			  for (const file of files) {
				console.log(`${file.name} (${file.id})`);
			  }
			  
			  res.render('dmslist.ejs', {
				filelist: files,
				level: req.user.level
				});
			  
			}
		  });
		  
			
		  });
		});
		
		/**
		 * Lists the names and IDs of up to 10 files.
		 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
		 */
		function listFiles (auth) {
		  const service = google.drive('v3');
		  service.files.list({
			auth: auth,
			pageSize: 100,
			fields: 'nextPageToken, files(id, name)'
		  }, (err, res) => {
			if (err) {
			  console.error('The API returned an error.');
			  throw err;
			}
			const files = res.data.files;
			if (files.length === 0) {
			  console.log('No files found.');
			} else {
				
			  console.log('Files Found!');
			  for (const file of files) {
				console.log(`${file.name} (${file.id})`);
			  }
			  
			  res.render('dmslist.ejs', {
				filelist: files,
				level: req.user.level
				});
			  
			}
		  });
		}
		// [END main_body]

	
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


