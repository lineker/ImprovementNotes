sap.ui.jsview("view.Admin", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.Admin
	*/ 
	getControllerName : function() {
		return "view.Admin";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.Admin
	*/ 
	createContent : function(oController) {
		
		var oShell = new sap.ui.ux3.Shell();
		
		//oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({key: "improve", text:"SAP Improve Thinking"}));
		oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({key: "users", text:"Users"}));
		oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({key: "notes", text:"Notes2"}));
		oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({key: "analytics", text:"Analytics"}));
		//oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({key: "listview", text:"ListView"}));
		
		var mContent = {};
		mContent.users = new sap.ui.jsview("view.AdminUsers");
		mContent.notes = new sap.ui.jsview("view.AdminNotes");
		mContent.analytics = new sap.ui.commons.TextField({key: "tf1", text: "charts here"});
		
		//set default page
		oShell.setContent(mContent.users);
		
		oShell.attachWorksetItemSelected(function(evt) {
			//evt is the item selected.
			var key = evt.getParameter("key");
			//alert(key);
			oShell.setContent(mContent[key]);
			
		});
 		return new sap.m.Page({
			title: "Title",
			showHeader: false,
			content: [
			          oShell
			]
		});

	}

});