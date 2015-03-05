var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Place Model
 * ==========
 */
 
var Place = new keystone.List('Place', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Place.add({
	title: { type: String, required: true },
	image: { type: Types.CloudinaryImage },
	content: { type: Types.Html, wysiwyg: true, height: 200 },
	location: { type: Types.Location},
	carReachableLocation: { type: Types.Location},
	defaultMapsZoom:{ type: Types.Number},
	categories: { type: Types.Relationship, ref: 'Category', many: true },
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
	wikipedia: { type: Types.Url },
	UNESCO: { type: Types.Boolean }
});

Place.defaultColumns = 'title, location, categories';
Place.register();
