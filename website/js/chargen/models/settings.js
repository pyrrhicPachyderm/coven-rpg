//A model for storing settings, for the user to configure the character creator's behaviour.

var Settings = Backbone.Model.extend({
	defaults: {
		allowLocalStorage: null, //null until preference is set, then true or false.
	},
	
	isLocalStorageAllowed: function() {
		//A value of null (the user has not yet made a decision) is taken as implicit consent.
		//So this function returns false only if allowLocalStorage is explicitly false.
		return this.get("allowLocalStorage") != false;
	},
});

var settings = new Settings;
