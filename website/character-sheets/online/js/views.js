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
			"click #save-sheet": "saveSheet",
			"click #load-sheet": function() {$("#load-sheet-file").click();},
			"change #load-sheet-file": "loadSheet",
			
			"click #is-tracking-experience": "updateIsTrackingExperience",
			"click #add-experience-submit": "addExperience",
			"keyup #add-experience-number": function(ev) {this.callOnEnter(ev, this.addExperience);},
			
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
		
		saveSheet: function() {
			let fileName = this.model.get("name");
			if(fileName == "") {
				fileName = "coven-sheet";
			}
			fileName+= ".json";
			
			let blob = new Blob([this.model.writeJSON()], {type: "application/json;charset=utf-8"});
			saveAs(blob, fileName);
		},
		
		loadSheet: function(ev) {
			let file = $(ev.currentTarget)[0].files[0];
			let reader = new FileReader();
			reader.onload = _.bind(function(ev) {
				this.model.readJSON(ev.target.result);
			}, this);
			reader.readAsText(file);
		},
		
		callOnEnter: function(ev, func) {
			if(ev.keyCode == 13) { //13 is the Enter key.
				func = _.bind(func, this);
				func(ev);
			}
		},
	});
	
	
	$("#sheet-el").html(new SheetView({
		model: new CharacterModel(),
	}).el);
});
