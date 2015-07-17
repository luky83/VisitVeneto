var keystone = require('keystone'),

exports = module.exports = function(req, res) {
	
	var places = []
	
	// Load places by category
	if (req.params.category) {
		keystone.list('Category').model.findOne({ key: req.params.category }).exec(function(err, result) {
			if (err) {
				res.json(places);
			} else {
				keystone.list('Place').model.find().where('categories').in([result]).exec(function(err, results) {
					places = results;
					res.json(places);
				});	
			}
		});
	} 
};
