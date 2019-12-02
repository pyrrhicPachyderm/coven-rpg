$(document).ready(function() {
	var SheetView = Backbone.View.extend({
		initialize: function () {
			//Do the initial render.
			//This must be done asynchronously for the jQuery in the function to work.
			//I'm not quite sure why.
			setTimeout(_.bind(this.render,this), 0);
			//Set up binding in the first direction: whenever the model changes, change the view.
			this.listenTo(this.model, "change", this.render);
		},
		
		template: _.template(
			$("#sheet-template").html()
		),
		
		render: function () {
			this.$el.html(this.template(this.model.getTemplateInput()));
			
			if(this.model.get("isTrackingExperience")) {
				$(".experience").show();
			} else {
				$(".experience").hide();
			}
			
			for(attributeID of Stats.attributeIDs) {
				let attributeScore = this.model.getAttribute(attributeID);
				this.createDots($("#attribute-" + attributeID), Stats.attributeMax, attributeScore);
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
			
			"click .attribute.dot": "changeAttribute",
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
		
		createDots: function(parent, numDots, filledDots) {
			for(let i = 0; i < numDots; i++) {
				let checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.classList.add("attribute");
				checkbox.classList.add("dot");
				if(i < filledDots) {
					checkbox.checked = true;
				}
				parent.append(checkbox);
			}
		},
		
		getDotsLevel: function(ev) {
			return $(ev.currentTarget).index() + 1;
		},
		
		getDotsID: function(ev, type) {
			let dotsElement = $(ev.currentTarget).parent();
			return attributeID = dotsElement.attr("id").replace(type + "-", "");
		},
		
		changeAttribute: function(ev) {
			let clickedDot = this.getDotsLevel(ev);
			let attributeID = this.getDotsID(ev, "attribute");
			
			let newValue = clickedDot == this.model.getAttribute(attributeID) ? 0 : clickedDot;
			this.model.setAttribute(attributeID, newValue);
		},
	});
	
	
	$("#sheet-el").html(new SheetView({
		model: new CharacterModel(),
	}).el);
});
