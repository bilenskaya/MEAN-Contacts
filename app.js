var
	http     = require('http'),
	express  = require('express'),
	app      = express(),
	mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	dbLoc    = 'mongodb://localhost/contacts3';

mongoose.connect(dbLoc);

//=======================
//  Database and Model
//=======================
var ContactSchema = new Schema({
	clean: String,
	name: {
		first: String,
		last: String
	},
	email: String,
	phone: String
}),
	Contact = mongoose.model('Contact', ContactSchema);



//=======================
//	Server Settings
//=======================
app.set('port', process.env.PORT || 3000)
   .set('views', __dirname + '/views')
   .engine('html', require('ejs').renderFile)
   .use(express.bodyParser())
   .use(express.methodOverride())
   .use(app.router)
   .use(express.static(__dirname + '/public'));



//=======================
//  API
//=======================
/**
 * Collection: Use get on '/contacts' and post on '/contacts'
 */
app.get('/api/contacts', function(req, res) {
	Contact.find({}, function(err, contacts) {
		res.send(contacts);
	});
});
app.post('/api/contacts', function(req, res) {
	new Contact({
		clean: 'test',
		name: {
			first: 'test',
			last: 'test'
		},
		email: 'test@test.test',
		phone: '523-262-2362'
	}).save(function(err, docs) {
		res.send(docs);
	});
});

/**
 * Element: Use get on '/contacts/:name', put on '/contacts/:name',
 * 			and delete on '/contacts/:name'
 */
app.get('/api/contacts/:name', function(req, res) {
	Contact.findOne({clean: req.params.name}, function(err, contact) {
		res.send(contact);
	});
});
app.post('/api/contacts/:name', function(req, res) {
	var b = req.body,
		clean = b.name.first + '-' + b.name.last,
		clean = clean.toLowerCase();

	Contact.update({clean: req.params.name}, {
		clean: clean,
		name: {
			first: b.name.first,
			last: b.name.last
		},
		email: b.email,
		phone: b.phone
	}, function(err) {
		console.log('Inside p');
		res.send(b);
	});
	
});
app.delete('/api/contacts/:name', function(req, res) {
	Contact.remove({clean: req.params.name}, function(err) {
		// Delete doesn't work without a callback function for some reason
		console.log('In DELETE');
		console.log(req.params.name);
	});
	// Since it's a single page webapp below is pointless
	// res.redirect('/');
});
app.get('/', function(req, res) {
	res.render('index.html', {layout: null}); // , {layout: null}
});





//=======================
//  Start Server
//=======================
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express running.');
});