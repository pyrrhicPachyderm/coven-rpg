$(document).ready(function() {
	var SheetView = Backbone.View.extend({
		initialize: function () {
			//Do the initial render.
			this.render();
			//Set up binding in the first direction: whenever the model changes, change the view.
			this.listenTo(this.model, "change", this.render);
		},
		
		template: _.template(
			$("#sheet-template").html()
		),
		
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			
			if(this.model.get("isTrackingExperience")) {
				$(".experience").show();
			} else {
				$(".experience").hide();
			}
		},
		
		events: {
			"click #is-tracking-experience": "updateIsTrackingExperience",
			"click #add-experience-submit": "addExperience",
			
			"change #character-name": function(ev) {this.readTextField(ev, "name");},
			"change #age": function(ev) {this.readTextField(ev, "age");},
			"change #player-name": function(ev) {this.readTextField(ev, "playerName");},
		},
		
		readTextField: function(ev, field) {
			this.model.set(field, $(ev.target).val());
		},
		
		updateIsTrackingExperience: function(ev) {
			let checked = $(ev.currentTarget).is(":checked");
			this.model.set("isTrackingExperience", checked);
		},
		
		addExperience: function() {
			let amountField = $("#add-experience-number");
			let amount = parseInt(amountField.val());
			amountField.val(0);
			this.model.addExperience(amount);
		},
	});
	
	
	$("#sheet-el").html(new SheetView({
		model: new CharacterModel(),
	}).el);
});
