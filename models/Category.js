var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Category Model
 * ==================
 */

var Category = new keystone.List('Category', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Category.add({
	name: { type: String, required: true },
	color: { type: Types.Color }
});

Category.defaultColumns = 'name, color';

Category.relationship({ ref: 'Post', path: 'categories' });

Category.relationship({ ref: 'Place', path: 'categories' });

Category.register();
