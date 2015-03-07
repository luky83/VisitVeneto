var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'accomodations';
	locals.filters = {
		accomodationType: req.params.accomodationType
	};
	locals.data = {
		accomodations: [],
		accomodationTypes: []
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('AccomodationType').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.accomodationTypes = results;
			
			// Load the counts for each accomodation type
			async.each(locals.data.accomodationTypes, function(accomodationType, next) {
				
				keystone.list('Accomodation').model.count().where('accomodationType').in([accomodationType.id]).exec(function(err, count) {
					accomodationType.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current accomodation type filter
	view.on('init', function(next) {
		
		if (req.params.accomodationType) {
			keystone.list('AccomodationType').model.findOne({ key: locals.filters.accomodationType }).exec(function(err, result) {
				locals.data.accomodationType = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Accomodation').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.populate('accomodationTypes');
		
		if (locals.data.accomodationType) {
			q.where('accomodationTypes').in([locals.data.accomodationType]);
		}
		
		q.exec(function(err, results) {
			locals.data.accomodations = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('accomodations');
	
};
