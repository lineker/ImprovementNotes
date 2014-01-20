sap.ui.jsview("view.AdminMaster", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.Master
	*/ 
	getControllerName : function() {
		return "view.AdminMaster";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.Master
	*/ 
	createContent : function(oController) {
		
		oController.populateModel(this);
		
		var newNoteTitle = new sap.m.Input({
	          type: sap.m.InputType.Text,
	          placeholder: 'Enter Title ...'
	        });
		var newNoteDescription = new sap.m.Input({
	          type: sap.m.InputType.Text,
	          placeholder: 'Enter Description ...'
	        });
		// create standard dialog containing a form to create a new note
	    var stdDialog = new sap.m.Dialog({
	      title: "Add Improvement Note",
	      content: [new sap.m.Label({
	          text: 'Title'
	        }),
	        newNoteTitle,

	        new sap.m.Label({
	          text: 'Description'
	        }),
	        newNoteDescription],
	      leftButton: new sap.m.Button({
	        text: "Add",
	        press: function () {
	          //Save here
	          oController.addNewNote(newNoteTitle.getValue(),newNoteDescription.getValue());
	          newNoteTitle.setValue("");
	          newNoteDescription.setValue("");
	          jQuery.sap.require("sap.m.MessageToast");
	          sap.m.MessageToast.show("'"+newNoteTitle.getValue()+"' was added : " + newNoteDescription.getValue());
	          stdDialog.close();
	        }
	      }),
	      rightButton: new sap.m.Button({
	        text: "Cancel",
	        press: function () {
	        	newNoteTitle.setValue("");
	        	newNoteDescription.setValue("");
	          stdDialog.close();
	        }
	      })
	    }).addStyleClass("sapUiPopupWithPadding");
		
	    //Create popup with note description
	    createPop = function (id, notetext) {
	    	var pop = new sap.m.ResponsivePopover({
	  	      title: "Do you want to favorite this?",
		      placement: sap.m.PlacementType.Bottom,
		      beginButton: new sap.m.Button({
		        icon : "sap-icon://favorite",
		        press: function () {
		          pop.close();
		          jQuery.sap.require("sap.m.MessageToast");
			      sap.m.MessageToast.show("+1 for Note " + id);
			      oController.increaseCounter();
		        }
		      }),
		      endButton: new sap.m.Button({
		        text: "Close",
		        press: function () {
		          pop.close();
		        }
		      }),
		      content: new sap.m.Label({
		          text: notetext
		      })
		    }).addStyleClass("sapUiPopupWithPadding");
	    	return pop;
	    };
	    
	    //1. Create a JSON model (oModel).
        /*var jsonModel = [           
			{	"id": "createTileId",
				"type" : "Create",
  	          	"title" : "Create Improve Note",
  	          	"info" : "What can we improve?",
  	          	"infoState": "Success",
  	          	"icon":"sap-icon://add"
			},
    		{	"id": "tileId0",
    	        "title": "More Cookies",
    	        "description": "We need more cookies in the kitchen",
    	        "count": 31,
    	        "info" : "Not much interest yet",
    	        "icon":"sap-icon://favorite"
    	    },
    	    {
    	        "id": "tileId1",
    	        "type" : "Monitor",
    	        "title": "More Water",
    	        "description": "Some bottle of water would be good",
    	        "count": 92,
    	        "info" : "Urgent",
    	        "infoState" : "Error",
    	        "icon":"sap-icon://favorite"
    	        	
    	    },
    	    {
    	        "id": "tileId2",
    	        "title": "Social events",
    	        "description": "We really need more social events to improve collaboration between team members.",
    	        "count": 14,
    	        "info" : "Not much interest yet",
    	        "icon":"sap-icon://favorite"
    	        
    	    },
    	    {
    	        "id": "tileId3",
    	        "title": "Improve SAP Portal",
    	        "description": "Is too hard to find stuff. We need to improve this.",
    	        "count": 46,
    	        "info" : "Worth taking a look",
    	        "infoState" : "Warning",
    	        "icon":"sap-icon://favorite"
    	    },
    	    {
    	        "id": "tileId4",
    	        "title": "Fish for lunch",
    	        "description": "Some fish for lunch wouldn't be a bad idea.",
    	        "count": 65,
    	        "info" : "Worth taking a look",
    	        "infoState" : "Warning",
    	        "icon":"sap-icon://favorite"
    	    }
       	];*/
        var openCreate = function(oControlEvent) { stdDialog.open(); };
        //4. Create an event handler method for when a Tile is clicked
        var onMyTileClicked = function(oControlEvent, oModel){
          
        	//COMMON code for all event handlers
          var selectedId = oControlEvent.getParameter("id");
          var modelId = null;
          var descriptionText = "";
          
          var customDataList = oControlEvent.getSource().getCustomData();
          //grab id
          if(customDataList!=null && customDataList.length<=2 && customDataList[0].getKey("modelId")){//} && customDataList[1].getKey("description")){
        	  modelId = customDataList[0].getValue("modelId");
        	  //debugger;
        	  //var view = this.getView();
        	  //var oModel = view.getModel();
      		  var oData = oModel.getData();

      		  for (var int = 0; int < oData.modelData.length; int++) {
      			 // alert(oData[int].id);
				 if(oData.modelData[int].id == modelId){
					 descriptionText = oData.modelData[int].description;
				 }
			  }
        	  
        	  //descriptionText = customDataList[1].getValue("description");
          }else {
        	  console.log("modelId not bound as CustomData to the TreeNode");
          }
          //alert(modelId);
          
          //create popover
          var pop = new sap.m.ResponsivePopover({
	  	      title: "Do you want to favorite this?",
		      placement: sap.m.PlacementType.Bottom,
		      beginButton: new sap.m.Button({
		        icon : "sap-icon://favorite",
		        press: function () {
		          pop.close();
		          jQuery.sap.require("sap.m.MessageToast");
			      sap.m.MessageToast.show("+1 for Note " + modelId);
			      oController.increaseCounter(modelId);
		        }
		      }),
		      endButton: new sap.m.Button({
		        text: "Close",
		        press: function () {
		          pop.close();
		        }
		      }),
		      content: new sap.m.Label({
		          text: descriptionText
		      })
		    }).addStyleClass("sapUiPopupWithPadding");
          
          pop.openBy(oControlEvent.getSource());
        };
        
       
        
        var oModel = this.getModel();
        console.log(oModel);
    	//oModel.setData({
    	//	modelData : jsonModel
    	//});
    	
    	 //sap.ui.getCore().setModel(oModel);
    	 
    	//2. Define a factory method for StandardTile elements (standardTileFactory).    
        var standardTileFactory = function(sId, oContext) {
        	//bind all properties from https://sapui5.netweaver.ondemand.com/sdk/#docs/api/symbols/sap.m.StandardTile.html
        	//except Type which had little effect Code:oTile.setType(sap.m.StandardTileType.Monitor);
        	//+ include our id from the model as CustomData to the TreeNode
        	
    		var oTile = new sap.m.StandardTile(sId, {
    			press : function(evt){
    				//alert(sId);
    				if(sId == "MyTileContainer-0")
    					openCreate(evt);
    				
    				else
    					onMyTileClicked(evt, oModel);
    					}
    			})
        		.bindProperty("title",oContext.sPath+"/title")
        		.bindProperty("number",oContext.sPath+"/count")
        		.bindProperty("info",oContext.sPath+"/info")
        		.bindProperty("type",oContext.sPath+"/type")
        		.bindProperty("infoState",oContext.sPath+"/infoState")
        		.bindProperty("icon",oContext.sPath+"/icon")
        		.addCustomData(new sap.ui.core.CustomData({
    				key: "modelId",	
    				value: oContext.oModel.getProperty(oContext.sPath+"/id"),
    				writeToDom: true}));
    			/*.addCustomData(new sap.ui.core.CustomData({
					key: "description",	
					value: oContext.oModel.getProperty(oContext.sPath+"/description"),
					writeToDom: true}));*/
    			

    		//Provide URI for icons
    		oTile.setIcon("sap-icon://favorite"); 
    		
    		//set unit
    		oTile.setNumberUnit("Votes");
    		
    		return oTile;
    	};
        
    	//3. Define a method for dynamically populate the TreeNodes of a Tree based on its model (createDynamicTreeNodesFromModel)
        var createDynamicTilesFromModel = function(oTileContainer, modelPath) {
        	if(oTileContainer.hasModel()==false){
        		console.log(oTileContainer + " has no model bound to it. Cannot create Tiles");
        		return;
        	}
        	
        	oTileContainer.bindAggregation("tiles",modelPath, standardTileFactory);	
        };
	    
        //5a. Create a TileContainer component
    	//5b. Set the Model of the TileContainer component 
    	var MyTileContainer = new sap.m.TileContainer("MyTileContainer", {
    		tileDelete : function (evt) {
    			var tile = evt.getParameter("tile");
    			var customDataList = tile.getCustomData();
    			if(customDataList!=null && customDataList.length <=2 && customDataList[0].getKey("modelId")){
		        	  modelId = customDataList[0].getValue("modelId");
		        	  console.log(modelId);
		        	  oController.handleTileDelete(modelId);
    			}else {
		        	  console.log("modelId not bound as CustomData to the TreeNode");
    			}
    			 
    			 evt.getSource().removeTile(tile);
    		}
    	});
        MyTileContainer.setModel(oModel);
        
        //5c. Dynamically create TileNodes from the model
        createDynamicTilesFromModel(MyTileContainer, "/modelData");
        
        //5d. Add event handler to all tiles 
        //Event handler is a different for each TileContainer)
        var tiles = MyTileContainer.getTiles();
        if(tiles!=null && tiles.length>=1){
        	for ( var i = 0; i < tiles.length; i++) {
        		/*if(i == 0) 
        			tiles[i].attachPress(openCreate);
        		else 
        			tiles[i].attachPress(onMyTileClicked);*/
			}
        }
        
     // create edit button
	    var editButton = new sap.m.Button({
	      text : "Edit",
	      icon : "sap-icon://edit",
	      press : function (evt) {
	        var newValue = !MyTileContainer.getEditable();
	        MyTileContainer.setEditable(newValue);
	        evt.getSource().setText((newValue) ? "Done" : "Edit");
	        evt.getSource().setIcon((newValue) ? "sap-icon://accept" : "sap-icon://edit");
	      }
	    });
        
        return MyTileContainer;
	    //return MyTileContainer;
	}

});