function toggleExperienceTracking() {
	character.experience.isTracking = document.getElementById('is-tracking-experience').checked;
	updatePageExperience();
}

function setExperienceTrackingToggle() {
	document.getElementById('is-tracking-experience').checked = character.experience.isTracking;
	updatePageExperience();
}

function getTotalExperience() {
	return character.experience.total;
}

function getRemainingExperience() {
	return getTotalExperience();
}

function updatePageExperience() {
	if(character.experience.isTracking) {
		$(".experience").show();
	} else {
		$(".experience").hide();
	}
	document.getElementById('experience-total').value = getTotalExperience();
	document.getElementById('experience-remaining').value = getRemainingExperience();
}

function addExperience(amount) {
	character.experience.total += amount;
	updatePageExperience();
}
