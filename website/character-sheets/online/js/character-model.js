var CharacterModel = Backbone.Model.extend({
	defaults: function () {
		return {
			name: "",
			age: "",
			playerName: "",
			isTrackingExperience: true,
			totalExperience: 100,
			stats: new StatsModel(),
		}
	},
	
	initialize: function() {
		this.remainingExperience = this.calculateRemainingExperience();
	},
	
	reset: function() {
		this.set(this.defaults());
		this.initialize();
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
	
	getAttribute: function(attribute) {
		return this.get("stats").getAttribute(attribute);
	},
	
	setAttribute: function(attribute, value) {
		this.get("stats").setAttribute(attribute, value);
		triggerChange(this, "stats");
	},
});
