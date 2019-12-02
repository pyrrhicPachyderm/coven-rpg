var triggerChange = function(object, attribute) {
	object.trigger("change");
	object.trigger("change:" + attribute);
}
