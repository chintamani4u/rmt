// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8081; // set our port

var mongoose   = require('mongoose');
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
//mongoose.connect('mongodb://chintan:chintan123@localhost:27017/rmt'); // connect to our database
mongoose.connect('mongodb://localhost/node_api'); // connect to our database
var Resource     = require('./app/models/rmt');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to Resource Manager api!' });	
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/tasks')

	// create a task (accessed at POST http://localhost:8080/tasks)
	.post(function(req, res) {
		
		var task = new Resource();		// create a new instance of the Resource model
		task.name = req.body.name;      // set the person name (comes from the request)
		task.task = req.body.task;      // set the task name (comes from the request)
		task.time = req.body.time;      // set the time name (comes from the request)

		task.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Resource created!' });
		});

		
	})

	// get all the tasks (accessed at GET http://localhost:8080/api/tasks)
	.get(function(req, res) {
		Resource.find(function(err, tasks) {
			if (err)
				res.send(err);

			res.json(tasks);
		});
	});

// on routes that end in /tasks/:task_id
// ----------------------------------------------------
router.route('/tasks/:task_id')

	// get the Task with that id
	.get(function(req, res) {
		Resource.findById(req.params.task_id, function(err, task) {
			if (err)
				res.send(err);
			res.json(task);
		});
	})

	// update the Task with this id
	.put(function(req, res) {
		Resource.findById(req.params.task_id, function(err, task) {

			if (err)
				res.send(err);

			task.name = req.body.name;       // update the task name (comes from the request)
            task.task = req.body.task;       // update the task name (comes from the request)
		    task.time = req.body.time;       // update the time name (comes from the request)
			task.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Task Resource updated!' });
			});

		});
	})

	// delete the Task with this id
	.delete(function(req, res) {
		Resource.remove({
			_id: req.params.task_id
		}, function(err, task) {
			if (err)
				res.send(err);

			res.json({ message: 'Task Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
