var CharacterListItem = Backbone.View.extend({
	tagName: "div",
	className: "character-list-item",
	model: CharacterModel,
	
	initialize: function () {
		//TODO
		this.render();
	},
	
	events: {
		//TODO
	},
	
	render: function() {
		//TODO
		
		return this;
	},
});

var CharacterListMenu = Backbone.View.extend({
	el: "#character-list-menu",
	collection: CharacterCollection,
	
	initialize: function () {
		//TODO
		this.render();
	},
	
	events: {
		//TODO
	},
	
	render: function() {
		//TODO
		
		return this;
	},
});

//TODO: Add buttons to show and hide the character list.

var characterListMenu = new CharacterListView({collection: characterCollection});
