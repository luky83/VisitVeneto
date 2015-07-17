var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'places';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		places: [],
		categories: []
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('Category').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.categories = results;
			
			// Load the counts for each category
			async.each(locals.data.categories, function(category, next) {
				
				keystone.list('Place').model.count().where('category').in([category.id]).exec(function(err, count) {
					category.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current category filter
	view.on('init', function(next) {
		
		if (req.params.category) {
			keystone.list('Category').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the places
	view.on('init', function(next) {
		
		var q = keystone.list('Place').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.populate('categories');
		
		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}
		
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
			locals.data.placesMarkers = markers;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('places');
	
};
