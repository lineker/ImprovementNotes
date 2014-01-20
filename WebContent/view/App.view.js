sap.ui.jsview("view.App", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.App
	*/ 
	getControllerName : function() {
		return "view.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.App
	*/ 
	createContent : function(oController) {
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		var app = null; 
		var page = null;
		
		if("admin" in oController.QueryString()){
			console.log("load admin page");
			app = new sap.m.App({initialPage:"Admin"});
			page = sap.ui.view({id:"Admin", viewName:"view.Admin", type:sap.ui.core.mvc.ViewType.JS});
		} else {
			page = sap.ui.view({id:"Master", viewName:"view.Master", type:sap.ui.core.mvc.ViewType.JS});
			app = new sap.m.App({initialPage:"Master"});
			//page.getController().nav = this.getController();
		}
		
		app.addPage(page);
 		return app;
	}

});