var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'places';
	locals.filters = {
		place: req.params.place
	};
	locals.data = {
		places: []
	};
	
	// Load the current place
	view.on('init', function(next) {
		
		var q = keystone.list('Place').model.findOne({
			slug: locals.filters.place
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.place = result;
			next(err);
		});
		
	});
	
	// Load other places
	view.on('init', function(next) {
		
		var q = keystone.list('Place').model.find().limit('4');
		
		q.exec(function(err, results) {
			locals.data.places = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('place');
	
};
