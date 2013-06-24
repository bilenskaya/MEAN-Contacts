var
	http     = require('http'),
	express  = require('express'),
	app      = express(),
	mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	dbLoc    = 'mongodb://localhost/MEAN-contacts';

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
   // Use ejs to render normal html files simply
   .engine('html', require('ejs').renderFile)
   .use(express.bodyParser())
   .use(express.methodOverride())
   .use(app.router)
   .use(express.static(__dirname + '/public'));



//=======================
//  API
//=======================
/**
 * Collection:  Get collection or add new contact to collection
 */
app.get('/api/contacts', function(req, res) {
	Contact.find({}, function(err, contacts) {
		res.send(contacts);
	});
});
app.post('/api/contacts', function(req, res) {
	var b = req.body,
		clean = (b.name.first + '-' + b.name.last).toLowerCase();
	new Contact({
		clean: clean,
		name: {
			first: b.name.first,
			last: b.name.last
		},
		email: b.email,
		phone: b.phone
	}).save(function(err, docs) {
		res.send(docs);
	});
});

/**
 * Element: Get element or edit element.
 */
app.get('/api/contacts/:name', function(req, res) {
	Contact.findOne({clean: req.params.name}, function(err, contact) {
		res.send(contact);
	});
});
app.put('/api/contacts/:name', function(req, res) {
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
		res.send(b);
	});
	
});
app.delete('/api/contacts/:name', function(req, res) {
	Contact.remove({clean: req.params.name}, function(err) {
		// Callback required for some reason.
		console.log(req.params.clean + ' deleted.');
	});
});

/**
 * Root
 */
app.get('/', function(req, res) {
	res.render('index.html', {layout: null});
});


//=======================
//  Start Server
//=======================
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express running.');
});