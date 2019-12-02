var Stats = {
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
	attributeMax: 5,
}
deepFreeze(Stats);

var AttributesModel = Backbone.Model.extend({
	defaults: function () {
		let obj = {};
		for(attributeID of Stats.attributeIDs) {
			obj[attributeID] = 0;
		}
		return obj;
	},
});

var StatsModel = Backbone.Model.extend({
	defaults: function () {
		return {
			attributes: new AttributesModel(),
		}
	},
	
	getAttribute: function(attribute) {
		return this.get("attributes").get(attribute);
	},
	
	setAttribute: function(attribute, value) {
		this.get("attributes").set(attribute, value);
		triggerChange(this, "attributes");
	},
});
