let experience = {
	totalExperience:100,
	
	toggle:function(checkboxElement) {
		if(checkboxElement.checked) {
			$(".experience").show();
			this.updatePage();
		} else {
			$(".experience").hide();
		}
	},
	
	getTotal:function() {
		return this.totalExperience;
	},
	
	getRemaining:function() {
		return this.getTotal();
	},
	
	updatePage:function() {
		document.getElementById('experience-total').value = this.getTotal();
		document.getElementById('experience-remaining').value = this.getRemaining();
	},
	
	add:function(amount) {
		this.totalExperience += amount;
		this.updatePage();
	},
}
