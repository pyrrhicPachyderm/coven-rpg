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

var triggerChange = function(object, attribute) {
	object.trigger("change");
	object.trigger("change:" + attribute);
}

var resetModel = function(model) {
	//Must pass silent so that it does not trigger changes.
	//If it does trigger changes, the view tries to re-render.
	//But everything is undefined and it breaks.
	model.clear({silent: true});
	//Everything gets redefined here, so this triggers the re-render.
	model.set(model.defaults());
	model.initialise();
}
