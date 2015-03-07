var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'accomodations';
	locals.filters = {
		accomodation: req.params.accomodation
	};
	locals.data = {
		accomodations: []
	};
	
	// Load the current accomodation
	view.on('init', function(next) {
		
		var q = keystone.list('Accomodation').model.findOne({
			slug: locals.filters.accomodation
		}).populate('author accomodationTypes');
		
		q.exec(function(err, result) {
			locals.data.accomodation = result;
			next(err);
		});
		
	});
	
	// Load other accomodations
	view.on('init', function(next) {
		
		var q = keystone.list('Accomodation').model.find().limit('4');
		
		q.exec(function(err, results) {
			locals.data.places = results;
			next(err);
		});
		
	});
	
	// Load the places
	view.on('init', function(next) {
		
		keystone.list('Place').model.find().exec(function(err, results) {
			var markers = []
			results.forEach(function (result, i, results) {
				if (result.carReachableLocation.geo) markers.push({ title : result.title, slug : result.slug, lat : result.carReachableLocation.geo[1], lon : result.carReachableLocation.geo[0] })
				else markers.push({ title : result.title, slug : result.slug, lat : result.location.geo[1], lon : result.location.geo[0] })
			});
			locals.data.places = markers;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('accomodation');
	
};
