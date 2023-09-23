var CharacterModel = Backbone.Model.extend({
	defaults: {
		name: "",
	},
});

var CharacterCollection = Backbone.Collection.extend({
	model: Character,
});

var characterCollection = new CharacterCollection;
