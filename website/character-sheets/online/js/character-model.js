var CharacterModel = Backbone.Model.extend({
	defaults: function () {
		return {
			name: "",
			age: "",
			playerName: "",
			isTrackingExperience: true,
			totalExperience: 100,
			attributes: Array(8).fill(0),
		}
	},
	
	attributeIDs: [
		"might",
		"grace",
		"ken",
		"wit",
		"will",
		"heed",
		"charm",
		"presence",
	],
	
	initialize: function() {
		this.remainingExperience = this.calculateRemainingExperience();
	},
	
	reset: function() {
		this.set(this.defaults());
	},
	
	setArrayElement: function(array, index, value) {
		this.get(array)[index] = value;
		this.trigger("change");
		this.trigger("change:" + array);
	},
	
	calculateRemainingExperience: function() {
		let remainingExperience = this.get("totalExperience");
		this.set("remainingExperience", remainingExperience);
	},
	
	addExperience: function(amount) {
		let currentExperience = this.get("totalExperience");
		currentExperience += amount;
		this.set("totalExperience", currentExperience);
		this.calculateRemainingExperience();
	},
	
	writeJSON: function() {
		return JSON.stringify(this.toJSON());
	},
	
	readJSON: function(str) {
		this.reset();
		this.set(JSON.parse(str));
	},
	
	getAttribute: function(attributeID) {
		let index = this.attributeIDs.indexOf(attributeID);
		return this.get("attributes")[index];
	},
	
	setAttribute: function(attributeID, value) {
		let index = this.attributeIDs.indexOf(attributeID);
		this.setArrayElement("attributes", index, value);
	},
});
