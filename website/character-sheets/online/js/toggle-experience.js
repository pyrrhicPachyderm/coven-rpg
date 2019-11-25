function toggleExperience(checkboxElement){
	if(checkboxElement.checked) {
		$(".experience").show();
		console.log("show");
	} else {
		$(".experience").hide();
		console.log("hide");
	}
}
