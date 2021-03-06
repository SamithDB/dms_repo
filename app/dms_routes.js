// app/routes.js
	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
	
		
	connection.query('USE ' + dbconfig.database);

	var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
   		 	process.env.USERPROFILE) + '/.credentials/';
	var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
	
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
				        			if(err4)
				        				console.log(err4);

				        			var query = connection.query('SELECT * FROM department',function(err4,deplist){
				        			if(err4)
				        				console.log(err4);

				        			var query = connection.query('SELECT * FROM store',function(err5,storelist){
				        			if(err5)
				        				console.log(err5);

				        			var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
				        			if(err6)
				        				console.log(err6);

				        				if(dmslevel[0].status == 'B'){
				        					res.render('dms_home.ejs', {
											employeelist : rowlist,
											user : rows[0],		//  pass to template
											allusrs : usrlist,
											department : deplist,
											store : storelist,
											level : req.user.level,
											dmslevel : dmslevel[0]
											});
				        				}else{
				        					res.redirect('/home');
				        				}

				        		});

				        	});
				        				
				        });

			        });
				        			
			    });
                   
        	});


		});


		// --------------------------------------------------------------------------------
		// --------------------------------------------------------------------------------
		// --------------------------------------------------------------------------------
		// --------------------------------------------------------------------------------

		'use strict';

		// [START main_body]
		const {google} = require('googleapis');
        const OAuth2 = google.auth.OAuth2;
		const express = require('express');
		const path = require('path');
		const fs = require('fs');
		const os = require('os');
		

		const scopes = ['https://www.googleapis.com/auth/drive'];

		// Create an oAuth2 client to authorize the API call
		const client2 = new OAuth2(
		  '230517522799-27ng1ovvthmq1hnfhrtqsjoqpt0pdk32.apps.googleusercontent.com',
		  'c7YPB0E9JwwAY35POsSN72BT',
		  'http://cloudhub.realmau5.com/dmscode'
		);

		const client1 = new OAuth2(
		  '230517522799-27ng1ovvthmq1hnfhrtqsjoqpt0pdk32.apps.googleusercontent.com',
		  'c7YPB0E9JwwAY35POsSN72BT',
		  'http://cloudhub.realmau5.com/newtoken'
		);
		
		
		app.get('/dms', (req, res) => {

			if(req.session.gclient ==  null){
				// Generate the url that will be used for authorization
				this.authorizeUrl = client2.generateAuthUrl({
			 	 access_type: 'offline',
			 	scope: scopes
				});

				res.redirect(this.authorizeUrl);
				
			}else{
			
				res.redirect('/dmshome');
			}
		
		});

		//Create new token -- Super admin Function

		app.post('/dmsnew', (req, res) => {

			if(req.body.pass == "cp@colombo"){

				// Generate the url that will be used for authorization
				this.authorizeUrl = client1.generateAuthUrl({
				  access_type: 'offline',
				  scope: scopes
				});

				res.redirect(this.authorizeUrl);

			}else{
				console.log("wrong Password");
				res.redirect('/home');
			}

			
		
		});

		//Token Refresh Code

		app.get('/refresh', (req, res) => {

			// Generate the url that will be used for authorization
			this.authorizeUrl = client.generateAuthUrl({
			  grant_type: 'refresh_token',
			  refresh_token: 'YOUR_REFRESH_TOKEN',
			  scope: scopes
			});
		
			opn(this.authorizeUrl, { wait: false });
		
		});

		// /oauth2callback?code=<code>
		// Open an http server to accept the oauth callback. In this
		// simple example, the only request to our webserver is to

		app.get('/dmscode', (req, res) => {

			// Check if we have previously stored a token.
				fs.readFile(TOKEN_PATH, function(err, token) {
				if (err) {

				res.redirect('/home');

				} else {
				      client2.credentials = JSON.parse(token);
				      //callback(client);
				       console.log("----------------token found---------------------");
				      console.log(client2.credentials);
				      req.session.gclient = client2;
				      res.redirect('/dmshome');
				}
			});

			
		});

		// ==================================
		// Create Token =====================
		// ==================================
		app.get('/newtoken', (req, res) => {

			//getNewToken(client, callback);
				const code = req.query.code;
		  		console.log("code----------"+code);

		  		client1.getToken(code, (err, tokens) => {
				if (err) {
			  	console.error('Error getting oAuth tokens:');
			  	throw err;
				}else{

				storeToken(tokens);
				console.log("Saved-------------- "+tokens);
				res.redirect('/home');

				}
		  	
		  	});

			
		});

		// Save the token
		function storeToken(token) {
				try {
				    fs.mkdirSync(TOKEN_DIR);
				  } catch (err) {
				    if (err.code != 'EEXIST') {
				      throw err;
				    }
				  }
				  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
				  console.log('Token stored to ' + TOKEN_PATH);
		}

		// ====================================
		// DMS List Files =====================
		// ====================================
		
		app.get('/listfiles', function(req, res1){

			fs.readFile(TOKEN_PATH, function(err, tokens) {

			console.log("tokens----------"+tokens);
		  	
			//client.credentials = tokens;
			//res.send('Authentication successful! Please return to the console.');
			
			
			const service = google.drive('v3');
			service.files.list({
			auth: client2,
			fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
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

				        				var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
					        			if(err6)
					        				console.log(err6);

				        				res1.render('dms_list.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevel[0],
										dmsfiles : files
										});

									});

				        		});
				        				
				        	});

			        	});
				        			
			    	});
                   
        		});  

			}

		  });

		  });
			
		});

	// =====================================
	// Dashboard for DMS====================
	// =====================================

	app.get('/dmsdash', function(req, res1) {

		const service = google.drive('v3');
			service.files.list({
			auth: client2,
			q: "'root' in parents",
			fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
		  	}, (err, res) => {
			if (err) {
			  console.error('The API returned an error.');
			  throw err;
			}
			const files = res.data.files;
			if (files.length === 0) {
			  console.log('No files found.');
			} else { 
		

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
				        			var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
					        			if(err6)
					        				console.log(err6);



				        			if(req.user.level=="admin"){
				        				res1.render('dms_dashboard.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevel[0],
										dmslevellist : dmslevellist,
										dmsfiles : files
										});
				        			}else{
				        				res1.redirect('/dmshome');
				        			}

				        			});

				        			});

				        			});
				        				
				        			});

			        			  	});
				        			
			        			});
                   
        		});

			}	
		});
	});

	// =====================================
	// View admins in dms===================
	// =====================================

	app.post('/dmsadminlist', function(req, res) {

		if(req.body.pass == "cp@colombo"){

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
				        			var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
					        			if(err6)
					        				console.log(err6);



				        			if(req.user.level=="admin"){
				        				res.render('dms_admins.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevel[0],
										dmslevellist : dmslevellist,
										});
				        			}else{
				        				res1.redirect('/dmshome');
				        			}

				        			});

				        			});

				        			});
				        				
				        			});

			        			  	});
				        			
			        			});
                   
        		});

			}else{
				console.log("wrong Password");
				res.redirect('/home');
			}
		
	});

		// ===================================
		// View Projects =====================
		// ===================================
		
		app.get('/viewprojectdep', function(req, res1){ //use to choose the department
			
			const service = google.drive('v3');
			service.files.list({
			auth: client2,
			fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
		  	}, (err, res) => {
			if (err) {
			  console.error('The API returned an error.');
			  throw err;
			}

				const service = google.drive('v3');
				service.files.list({
				auth: client2,
				q: "'root' in parents",
				fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
			  	}, (err2, res2) => {

		  		if (err2) {
			  		console.error('The API returned an error.');
			  		throw err2;
				}
					const depfolders = res2.data.files;
					if (depfolders.length === 0) {
					  console.log('No depfolders found.');
					} else {
						console.log('Dep Found!');
						const files = res.data.files;
						if (files.length === 0) {
						  console.log('No files found.');
						} else {
							
						  console.log('Files Found!');

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

				        				var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
					        			if(err6)
					        				console.log(err6);

				        				res1.render('dms_startlistprojects.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevel[0],
										dmsfiles : files,
										depfolders : depfolders
										});

									});

				        		});
				        				
				        	});

			        	});
				        			
			    	});
                   
        		   });  

			  	 }

			   }

			  });

		  	});
			
		});

		app.post('/viewproject', function(req, res1){

			var projectparent = req.body.depfolder;
			console.log(projectparent);
			const service = google.drive('v3');
			service.files.list({
			auth: client2,
			fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
		  	}, (err, res) => {
			if (err) {
			  console.error('The API returned an error.');
			  throw err;
			}

				const service = google.drive('v3');
				service.files.list({
				auth: client2,
				q: "'root' in parents",
				fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
			  	}, (err2, res2) => {

		  		if (err2) {
			  		console.error('The API returned an error.');
			  		throw err2;
				}

				const service = google.drive('v3');
				service.files.list({
				auth: client2,
				q: `'${projectparent}' in parents`,
				fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
			  	}, (err3, res3) => {

		  		if (err3) {
			  		console.error('The API returned an error.');
			  		throw err3;
				}


					const depfolders = res2.data.files;
					if (depfolders.length === 0) {
					  console.log('No depfolders found.');
					} else {

						const files = res.data.files;
						if (files.length === 0) {
						  console.log('No files found.');
						} else {
							
						  console.log('Files Found!');
						  for (const file of files) {
						  		console.log(`${file.name} (${file.id})`);
						 	 } 

						 	 	const listfiles = res3.data.files;
								if (listfiles.length === 0) {
								  console.log('No files found.');
								} else { 

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

				        				var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
					        			if(err6)
					        				console.log(err6);

				        				res1.render('dms_listprojects.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevel[0],
										dmsfiles : files,
										dmslist : listfiles,
										depfolders : depfolders,
										projectdep : projectparent
										});

									});

				        		});
				        				
				        	});

			        	});
				        			
			    	});
                   
        		   });  

			  	 }

			   }

			   }

			   });

			  });

		  	});
			
		});

		// ===================================
		// View sections =====================
		// ===================================
		
		app.get('/viewsec', function(req, res1){
			
			const service = google.drive('v3');
			service.files.list({
			auth: client2,
			fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
		  	}, (err, res) => {
			if (err) {
			  console.error('The API returned an error.');
			  throw err;
			}

				const service = google.drive('v3');
				service.files.list({
				auth: client2,
				q: "'root' in parents",
				fields: 'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
			  	}, (err2, res2) => {

		  		if (err2) {
			  		console.error('The API returned an error.');
			  		throw err2;
				}
					const depfolders = res2.data.files;
					if (depfolders.length === 0) {
					  console.log('No depfolders found.');
					} else {

						const files = res.data.files;
						if (files.length === 0) {
						  console.log('No files found.');
						} else {
							
						  console.log('Files Found!'); 

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

				        				var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
					        			if(err6)
					        				console.log(err6);

				        				res1.render('dms_sections.ejs', {
										employeelist : rowlist,
										user : rows[0],		//  pass to template
										allusrs : usrlist,
										department : deplist,
										store : storelist,
										level : req.user.level,
										dmslevel : dmslevel[0],
										dmsfiles : files,
										depfolders : depfolders
										});

									});

				        		});
				        				
				        	});

			        	});
				        			
			    	});
                   
        		   });  

			  	 }

			   }

			  });

		  	});
			
		});


		// ====================================
		// DMS Download Files =====================
		// ====================================

		const uuid = require('uuid');
		
		app.post('/down', function(req, res){

			const fileId = req.body.fileid;
		  	const dest = fs.createWriteStream(req.body.filename);

		  	const drive = google.drive({
			 version: 'v3',
			  auth: client2
			});

			    return new Promise(async (resolve, reject) => {
			    const filePath = path.join(os.tmpdir(), uuid.v4());
			    console.log(`writing to ${filePath}`);
			    const dest = fs.createWriteStream(filePath);
			    let progress = 0;
			    const res = await drive.files.get(
			      {fileId, alt: 'media'},
			      {responseType: 'stream'}
			    );
			    res.data
			      .on('end', () => {
			        console.log('Done downloading file.');
			        resolve(filePath);
			      })
			      .on('error', err => {
			        console.error('Error downloading file.');
			        reject(err);
			      })
			      .on('data', d => {
			        progress += d.length;
			        process.stdout.clearLine();
			        process.stdout.cursorTo(0);
			        process.stdout.write(`Downloaded ${progress} bytes`);
			      })
			      .pipe(dest);
			  });
			

			// if invoked directly (not tests), authenticate and run the samples
			if (module === require.main) {
			  if (process.argv.length !== 3) {
			    console.error('Usage: node samples/drive/download.js $FILE_ID');
			    process.exit();
			  }
			  const fileId = process.argv[2];
			  const scopes = [
			    'https://www.googleapis.com/auth/drive',
			    'https://www.googleapis.com/auth/drive.appdata',
			    'https://www.googleapis.com/auth/drive.file',
			    'https://www.googleapis.com/auth/drive.metadata',
			    'https://www.googleapis.com/auth/drive.metadata.readonly',
			    'https://www.googleapis.com/auth/drive.photos.readonly',
			    'https://www.googleapis.com/auth/drive.readonly'
			  ];
			  sampleClient.authenticate(scopes)
			    .then(c => runSample(fileId))
			    .catch(console.error);
			}

			res.redirect('/listfiles');

		});

		// ====================================
		// DMS View Files =====================
		// ====================================
		
		app.post('/view', function(req, res){

			const fileId = req.body.fileid;

		  	const drive = google.drive({
			 version: 'v3',
			  auth: client
			});
		  	console.log(fileId);

		  	drive.files.get(
		    {fileId, alt: 'media'},
		    {fields:"webContentLink"},
		    (err, res) => {
		      if (err) {
		        console.error(err);
		        throw err;
		      }else{
		      	console.log(webContentLink);
		      }
		     
		    });

		});

		// ====================================
		// DMS Uploader ===========================
		// ====================================

		app.get('/dmsup', function(req, res) {
		

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);

			        			var query = connection.query('SELECT * FROM employee',function(err3,rowlist){
				        		if(err3)
				        			console.log(err3);

				        			var query = connection.query('SELECT * FROM login',function(err4,usrlist){
				        			if(err4)
				        				console.log(err4);

				        			var query = connection.query('SELECT * FROM department',function(err4,deplist){
				        			if(err4)
				        				console.log(err4);

				        			var query = connection.query('SELECT * FROM store',function(err5,storelist){
				        			if(err5)
				        				console.log(err5);

				        			var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
				        			if(err6)
				        				console.log(err6);

				        					res.render('dms_uploader.ejs', {
											employeelist : rowlist,
											user : rows[0],		//  pass to template
											allusrs : usrlist,
											department : deplist,
											store : storelist,
											level : req.user.level,
											dmslevel : dmslevel[0]
											});

				        		});

				        	});
				        				
				        });

			        });
				        			
			    });
                   
        	});


		});

		// ====================================
		// Upload Files =====================
		// ====================================
		

		//var FileReader = require('filereader');
		//var reader = new FileReader();

		app.post('/up', function(req, res){

			if (!req.files)
		    	res.redirect('/dmsup');


		    var fileMetadata = {
			  'name': 'photo.jpg'
			};
			var media = {
			  mimeType: 'image/jpeg',
			  body: fs.readFile(res.files.value)
			};
			const drive = google.drive({
			 version: 'v3',
			  auth: client2
			});

			drive.files.create({
			  resource: fileMetadata,
			  media: media,
			  fields: 'id'
			}, function (err, file) {
			  if (err) {
			    // Handle error
			    console.error(err);
			  } else {
			    console.log('File Id: ', file.uploadid);
			  }
			});
		

		});

		// ==================================
		// Create Department Folder =========
		// ==================================

		app.post('/depfolder', function(req, res){

		var fileMetadata = {
		'name': req.body.foldername,
		'mimeType': 'application/vnd.google-apps.folder'
		
		};

		const drive = google.drive({
			 version: 'v3',
			  auth: client2
			});

		drive.files.create({
		  resource: fileMetadata,
		  fields: 'id'
		}, function (err, file) {
		  if (err) {
		    // Handle error
		    console.error(err);
		  } else {
		    console.log('Folder Id: ', file.data.id);
		    res.redirect('/dmsdash');
		  }
		});
		

		});

		

		// ===============================
		// New Project ===================
		// ===============================

		app.post('/newproject', function(req, res){

		var name = req.body.projectname;
		var dep = req.body.depid;
		var sec = req.body.secid;
		var st = req.body.st;

		console.log(name);
		console.log(dep);
		console.log(sec);
		console.log(st);

		const drive = google.drive({
			 version: 'v3',
			  auth: client2
			});
		var folderId = sec;
		var projectId;
		var subfolderId;

		var fileMetadata = {
			'name': name,
			parents: [folderId],
			'mimeType': 'application/vnd.google-apps.folder'
			};

			drive.files.create({
				resource: fileMetadata,
				fields: 'id'
			}, function (err, file) {
				if (err) {
				// Handle error
					console.error(err);
				} else {
					console.log('Projects Folder Id: ', file.data.id);
					projectId = file.data.id;
				

		if(st == "la_1"){  //Legal Division - Lands

					var folarr = [ 'Extracts', 'Previous Deeds', 'Previous Plans', 'Sales Agreements', 'Power of Attorneys', 'Approval Letters', 'Approved Plans', 'Registered Deeds', 'Title Reports & Pedigrees', 'Title Certificates', 'Cadastral Maps', 'Other Documents', 'Condition Letters'  ];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);

						  }

						  }

						});


					}


		
		}else if(st == "la_2"){ //Legal Division - Apartments

					var folarr = [ 'Extracts', 'Previous Deeds', 'Previous Plans', 'Sales Agreements', 'Power of Attorneys', 'Approval Letters', 'Approved Plans', 'Registered Deeds', 'Title Reports & Pedigrees', 'Title Certificates', 'Cadastral Maps', 'Other Documents', 'Condition Letters'  ];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);

						    

						  }

						});


					}

				

		}else if(st == "su"){ //Survey Division

					var folarr = [ 'Survey Plans', 'Data'];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);
						  }

						});
					}

		}else if( st == "d_1"){ //Development Division - Lands

					var folarr = [ 'Final cost'];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);
						  }

						});
					}

		}else if(st == "d_2"){ //Development Division - Apartments

					var folarr = [ 'Final cost'];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);
						  }

						});
					}

		}else if(st == "sa"){ //Sales Division - Lands

					var folarr = [ 'Approved Price List', 'Stock', 'Document Files', 'Approved Plans', 'Condition Letters'];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);
						  }

						});
					}

		}else if(st == "ac"){ //Accounts Division

					var folarr = [ 'Quick Book data and Local Files - Auto Sync'];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);
						  }

						});
					}

		}else if(st == "rd"){ //Recovery  Division

					var folarr = [ 'All Local Files - Auto Sync' ];

					for(var i = 0;i < folarr.length;i++){
						
						var fileMetadata = {
						'name': folarr[i],
						parents: [projectId],
						'mimeType': 'application/vnd.google-apps.folder'
						};

						drive.files.create({
						  resource: fileMetadata,
						  fields: 'id, name'
						}, function (err, file) {
						  if (err) {
						    // Handle error
						    console.error(err);
						  } else {
						    console.log('Folder Id: ', file.data.id);
						    console.log('folder name: ',  file.data.name);
						  }

						});
					}

		}

		
		res.redirect('/viewprojectdep');
		}

		});

		});


		// ===============================
		// New Section ===================
		// ===============================

		app.post('/newsec', function(req, res){

		var folderId = req.body.depfolder;
		var fileMetadata = {
		'name': req.body.secname,
		parents: [folderId],
		'mimeType': 'application/vnd.google-apps.folder'
		
		};

		const drive = google.drive({
			 version: 'v3',
			  auth: client2
			});

		drive.files.create({
		  resource: fileMetadata,
		  fields: 'id'
		}, function (err, file) {
		  if (err) {
		    // Handle error
		    console.error(err);
		  } else {
		    console.log('Folder Id: ', file.data.id);
		    res.redirect('/viewsec');
		    
		  }
		});
		

		});

		// ==============================
		// G Picker =====================
		// ==============================

		var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;

		app.get('/pickerup', function(req, res) {

						connection.query("SELECT * FROM employee WHERE login_idlogin = ?",[req.user.idlogin], function(err, rows) {
	                    if (err)
	                         console.log(err);

	                    var query = connection.query('SELECT * FROM employee',function(err3,rowlist){
				        		if(err3)
				        			console.log(err3);

				        var query = connection.query('SELECT * FROM login',function(err4,usrlist){
				        	if(err4)
				        		console.log(err4);

				        var query = connection.query('SELECT * FROM department',function(err4,deplist){
				        	if(err4)
				        		console.log(err4);

				        var query = connection.query('SELECT * FROM store',function(err5,storelist){
				        	if(err5)
				        		console.log(err5);

				        var query = connection.query('SELECT * FROM dmslevel WHERE login_idlogin = ? ',[req.user.idlogin],function(err6,dmslevel){
				        	if(err6)
				        		console.log(err6);

	                    console.log(req.session.gclient.credentials);
 
						var tokenProvider = new GoogleTokenProvider({
						    refresh_token: req.session.gclient.credentials.refresh_token, 
						    client_id:     '230517522799-27ng1ovvthmq1hnfhrtqsjoqpt0pdk32.apps.googleusercontent.com', 
						    client_secret: 'c7YPB0E9JwwAY35POsSN72BT'
						  });
						tokenProvider.getToken(function (err, newtoken) {
						 console.log("new token---"+newtoken);
						
						if(dmslevel[0].status == 'B'){
				        	res.render('picker.ejs', {
							employeelist : rowlist,
							user : rows[0],		//  pass to template
							allusrs : usrlist,
							department : deplist,
							store : storelist,
							level : req.user.level,
							dmslevel : dmslevel[0],
							token : newtoken
							});
				        }else{
				        	res.redirect('/home');
				        }

	                    });

						});
				        });
				        });
				        });
				    	});
	        			});

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


