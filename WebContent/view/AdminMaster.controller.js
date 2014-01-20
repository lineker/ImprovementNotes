sap.ui.controller("view.AdminMaster", {

	onInit: function() {
	    jQuery.sap.require("sap.m.MessageBox");
	 
	  //url: "https://playgroundi841041trial.hanatrial.ondemand.com/playground/api2?json", 
	    
	    
		//view.setModel(new sap.ui.model.json.JSONModel("model/improve-mock.json"));
	  },
	
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
	},  
	  
	handleListItemPress : function (evt) {
		var context = evt.getSource().getBindingContext();
		this.nav.to("Page2", context);
		
	},
	
	handleEditPress: function(evt) {
	    var oTileContainer = this.getView().byId("container");
	    var newValue = ! oTileContainer.getEditable();
	    oTileContainer.setEditable(newValue);
	    evt.getSource().setText(newValue ? "Done" : "Edit");
	    evt.getSource().setIcon(newValue ? "sap-icon://accept" : "sap-icon://edit");
	  },

	handleTileDelete: function(NoteId) {
		
		jQuery.sap.log.info("counter increased");
		var view = this.getView();

		$.ajax({
			  type: 'POST',
			  url: this.getAddress(),
			  data: {id: NoteId, action: "delete"},
			  success: function (result){
				  	var oModel = view.getModel();;
				  	console.log(result);
		        	oModel.setData(result);
		        	//view.setModel(oModel);

		        	console.log(oModel.getData());
		        	console.log(result);
		        	oModel.updateBindings();
		        	
			  },
			  dataType: "json",
			  async:false
			});
	},
	
	increaseCounter: function (NoteId) {
		jQuery.sap.log.info("counter increased");
		var view = this.getView();
		//update DB
		
		$.ajax({
			  type: 'POST',
			  url: this.getAddress(),
			  data: {id: NoteId, action: "update"},
			  success: function (result){
				  	var oModel = view.getModel();;
				  	
		        	oModel.setData(result);
		        	//view.setModel(oModel);

		        	console.log(oModel.getData());
		        	console.log(result);
		        	oModel.updateBindings();
		        	
			  },
			  dataType: "json",
			  async:false
			});
		
		/*for (var int = 0; int < oData.modelData.length; int++) {
			if(oData.modelData[int].id == NoteId){
				if(oData.modelData[int].type == "Monitor") {
					oData.modelData[int].count = oData.modelData[int].count-1;
					oData.modelData[int].type = "None";
				} else {
					oData.modelData[int].count = oData.modelData[int].count+1;
					//alert(oData.modelData[int].count);
					oData.modelData[int].type = "Monitor";
				}
			}
		}*/
		
    },
    
    addNewNote: function(title, text) {
    	var view = this.getView();
    	console.log("added new note");
    	$.ajax({
			  type: 'POST',
			  url: this.getAddress(),
			  data: {title: title, description: text, action: "add"},
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
    	
    	
    	
    	/*
    	var view = this.getView();
    	var oModel = view.getModel();
		var oData = oModel.getData();
	
		var newNote = view.getModel().getData();
		newNote.id = "tileid"+oData.modelData.length;
		newNote.title = title;
		newNote.description = text;
		newNote.count = 1;
		newNote.icon = "sap-icon://favorite";
		newNote.info = "Not much interest yet";
		newNote.type = "Monitor";
		//oDelta.modelData.push(newNote);
		oModel.getData().modelData[oData.modelData.length] = newNote;
		oModel.updateBindings();*/
    },
    
    getTitleType: function(count) {
    	return "Important";
    },
    
	onAfterRendering: function() {
		
	},

});