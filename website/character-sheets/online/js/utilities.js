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
