function SetupWizard4Assistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SetupWizard4Assistant.prototype.setup = function() {
	this.controller.setupWidget("phoneLoader", {
		spinnerSize: "large"
	}, {
		spinning: true
	});
		Voogle.getGVNumber(kt.cookies.get("voogle_userString"), function(num){
			kt.cookies.set("voogle_googleNumber", num);
			this.controller.stageController.swapScene("setupWizard6");
		}.bind(this));
};

SetupWizard4Assistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SetupWizard4Assistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SetupWizard4Assistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
