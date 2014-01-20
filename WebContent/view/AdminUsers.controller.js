sap.ui.controller("view.AdminUsers", {

	getAddress : function() {
		var host = window.location.host;
		var http = "https";
		if(host.indexOf("localhost") != -1){
			http ="http";
		}
		return http+"://"+window.location.host+"/playground/api2?json&users";
	},
	  
	populateModel : function(view){
		console.log(this.getAddress());
		
		var aData = [
				        {email: "Dente", id: "c3a1c7e0-7eca-11e3-baa7-0800200c9a66"},
				        {email: "Friese", id: "cf0e20b0-7eca-11e3-baa7-0800200c9a66"},
				        {email: "Mann", id: "d236b0e0-7eca-11e3-baa7-0800200c9a66"},
				        {email: "Schutt", id: "d82f7810-7eca-11e3-baa7-0800200c9a66"}
				];
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({modelData: aData});
		view.setModel(oModel);
		
		$.ajax({
	    	 url: this.getAddress(), 
	        type: 'GET', dataType: 'json',
	        async: false,
	        success: function doSubmitSuccess(result) {
	        	var oModel = new sap.ui.model.json.JSONModel();
	        	oModel.setData(result);
	        	view.setModel(oModel);
	        	//view.setModel(result);
	        	console.log(oModel.getData());
	        	console.log(result);
	        }
	    });
	},
	handleQuickAdd : function(text) {
		var view = this.getView();
    	console.log("added new user");
    	$.ajax({
			  type: 'POST',
			  url: this.getAddress(),
			  data: {email: text, action: "adduser"},
			  success: function (result){
				  	var oModel = view.getModel();;
				  	
		        	oModel.setData(result);
		        	//view.setModel(result);
		        	console.log(oModel.getData());
		        	console.log(result);
		        	oModel.updateBindings();
			  },
			  dataType: "json",
			  async:false
			});
	}
});