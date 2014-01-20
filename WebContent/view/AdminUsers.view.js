sap.ui.jsview("view.AdminUsers", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.AdminUsers
	*/ 
	getControllerName : function() {
		return "view.AdminUsers";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.AdminUsers
	*/ 
	createContent : function(oController) {
		
		oController.populateModel(this);
		
		var quickAdd = new sap.ui.layout.HorizontalLayout("Layout1", {
        	content: [
        	 new sap.ui.commons.Label({text: "Quick Add : "}), 
			 new sap.ui.commons.TextField("txtQuickAdd"),
			 new sap.ui.commons.Button({text: "Add", press: function() { 
				 if(jQuery.sap.byId("txtQuickAdd").val()) { 
					 oController.handleQuickAdd(jQuery.sap.byId("txtQuickAdd").val()); 
					 jQuery.sap.byId("txtQuickAdd").val("");} 
				 }
			 }
			 )]
		});
		
		//Create an instance of the table control
		var oTable = new sap.ui.table.Table({
		        title: "Users",
		        visibleRowCount: 7,
		        firstVisibleRow: 3,
		        selectionMode: sap.ui.table.SelectionMode.Single,
		        toolbar: new sap.ui.commons.Toolbar({items: [ 
		                new sap.ui.commons.Button({text: "Update CSV", press: function() { alert("NOT IMPLEMENTED!"); }}),
		                new sap.ui.commons.Button({text: "Send Invitations", press: function() { alert("NOT IMPLEMENTED!"); }})
		        ]}),
		        extension: [ quickAdd ]
		});

		//Define the columns and the control templates to be used
		oTable.addColumn(new sap.ui.table.Column({
	        label: new sap.ui.commons.Label({text: "Email"}),
	        template: new sap.ui.commons.TextView().bindProperty("text", "email"),
	        sortProperty: "email",
	        filterProperty: "email",
	        width: "100px"
		}));
		oTable.addColumn(new sap.ui.table.Column({
		        label: new sap.ui.commons.Label({text: "Id"}),
		        template: new sap.ui.commons.TextView().bindProperty("text", "id"),
		        sortProperty: "id",
		        filterProperty: "id",
		        width: "100px"
		}));

		//Create a model and bind the table rows to this model
		var oModel = this.getModel();
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");

		//Initially sort the table
		oTable.sort(oTable.getColumns()[0]);
		
		
		
		
 		return oTable;
	}

});