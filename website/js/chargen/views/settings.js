var CookieConsentBar = Backbone.View.extend({
	el: "#cookie-consent-bar",
	model: Settings,
	
	initialize: function () {
		this.model.on("change:allowLocalStorage", this.render, this);
		this.render();
	},
	
	events: {
		"click .accept": "accept",
		"click .decline": "decline",
	},
	
	render: function() {
		//If allowLocalStorage has been set definitely true or false, hide the bar.
		//If it's still null (not yet been set), keep showing the bar.
		var allowLocalStorage = this.model.get("allowLocalStorage");
		if(allowLocalStorage == true || allowLocalStorage == false) {
			this.$el.hide();
		} else {
			this.$el.show();
		}
		
		return this;
	},
	
	accept: function() {
		this.model.set("allowLocalStorage", true);
	},
	decline: function() {
		this.model.set("allowLocalStorage", false);
	},
});

var cookieConsentBar = new CookieConsentBar({model: settings});
