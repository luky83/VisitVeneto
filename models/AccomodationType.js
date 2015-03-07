var keystone = require('keystone');

/**
 * Accomodation type Model
 * ==================
 */

var AccomodationType = new keystone.List('AccomodationType', {
	autokey: { from: 'name', path: 'key', unique: true }
});

AccomodationType.add({
	name: { type: String, required: true }
});

AccomodationType.relationship({ ref: 'Accomodation', path: 'types' });

// AccomodationType.relationship({ ref: 'Place', path: 'categories' });

AccomodationType.register();
