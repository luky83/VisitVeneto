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
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 }
	},
	location: { type: Types.Location},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Place.defaultColumns = 'title, location';
Place.register();
