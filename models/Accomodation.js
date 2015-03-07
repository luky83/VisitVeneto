var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Accomodation Model
 * ==========
 */
 
var Accomodation = new keystone.List('Accomodation', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Accomodation.add({
	title: { type: String, required: true },
	image: { type: Types.CloudinaryImage },
	content: { type: Types.Html, wysiwyg: true, height: 200 },
	location: { type: Types.Location},
	defaultMapsZoom:{ type: Types.Number},
	accomodationTypes: { type: Types.Relationship, ref: 'AccomodationType', many: true },
	season: { 
		jennuary: {type: Types.Select, options:[1,2,3,4,5] },
		february: {type: Types.Select, options:[1,2,3,4,5] },
		march: {type: Types.Select, options:[1,2,3,4,5] },
		april: {type: Types.Select, options:[1,2,3,4,5] },
		may: {type: Types.Select, options:[1,2,3,4,5] },
		june: {type: Types.Select, options:[1,2,3,4,5] },
		july: {type: Types.Select, options:[1,2,3,4,5] },
		august: {type: Types.Select, options:[1,2,3,4,5] },
		september: {type: Types.Select, options:[1,2,3,4,5] },
		october: {type: Types.Select, options:[1,2,3,4,5] },
		november: {type: Types.Select, options:[1,2,3,4,5] },
		december: {type: Types.Select, options:[1,2,3,4,5] }
	},
	prices: {
		single: {type: Types.Money},
		double: {type: Types.Money},
		price: {type: Types.Money}
	}
});

Accomodation.defaultColumns = 'title, location, accomodationTypes';
Accomodation.register();
