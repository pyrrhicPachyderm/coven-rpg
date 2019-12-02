var deepFreeze = function(obj) {
	for(property in obj) {
		if(Object.prototype.hasOwnProperty.call(obj, property)
			&& obj[property] != null
			&& typeof(obj[property]) == "object") {
			deepFreeze(obj[property]);
		}
	}
	Object.freeze(obj);
}

var triggerChange = function(model, attribute) {
	model.trigger("change");
	model.trigger("change:" + attribute);
}

var resetModel = function(model) {
	//Must pass silent so that it does not trigger changes.
	//If it does trigger changes, the view tries to re-render.
	//But everything is undefined and it breaks.
	model.clear({silent: true});
	//Everything gets redefined here, so this triggers the re-render.
	model.set(model.defaults());
	model.initialize();
}

//Note: the below function assumes that any nesting of Backbone Models is direct.
//i.e. Any attributes that contain Backbone Models are those Backbone Models themselves.
//We don't have attributes that are arrays of Backbone Models, or plain JS objects containing
//Backbone Models.
var loadModelFromJSON = function(model, obj) {
	resetModel(model);
	
	for(property in obj) {
		if(Object.prototype.hasOwnProperty.call(obj, property)) {
			if(model.get(property) instanceof Backbone.Model) {
				loadModelFromJSON(model.get(property), obj[property]);
				triggerChange(model, property);
			} else {
				model.set(property, obj[property]);
			}
		}
	}
}
