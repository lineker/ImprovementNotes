sap.ui.controller("view.AdminNotes", {

	getAddress : function() {
		var host = window.location.host;
		var http = "https";
		if(host.indexOf("localhost") != -1){
			http ="http";
		}
		return http+"://"+window.location.host+"/playground/api2?json";
	},
	  
	populateModel : function(view){
		console.log(this.getAddress());
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
	}

});