jQuery.sap.declare("Application");
jQuery.sap.require("sap.ui.app.Application"); 

sap.ui.app.Application.extend("Application", {

    init : function() {
        // set global models
    	
    	//sap.ui.getCore().setModel(model);
    },
    
    main : function() {     
        // create app view and put to html root element
        var root = this.getRoot();
        
        //data model
        var oModel = new sap.ui.model.json.JSONModel("model/improve-mock.json");
        
        // set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		

        //load App view
        var oView = sap.ui.view({
			id : "app",
			viewName : "view.App",
			type : "JS",
			viewData : { component : this }
		});
        
        oView.setModel(i18nModel, "i18n");
        oView.setModel(oModel);
        oView.placeAt(root);
        
        //sap.ui.jsview("app", "view.App").placeAt(root);
    }
});