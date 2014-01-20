sap.ui.jsview("view.AdminNotes", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.AdminNotes
	*/ 
	getControllerName : function() {
		return "view.AdminNotes";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.AdminNotes
	*/ 
	createContent : function(oController) {
		
		oController.populateModel(this);
		
		//Create a custom control as template for the Dataset items 
		sap.ui.core.Control.extend("ItemLayout", {
		    metadata : {
		        aggregations : {
					"link" : {type : "sap.ui.commons.Link", multiple : false},
					"image" : {type : "sap.ui.commons.Image", multiple : false},
					"form" : {type : "sap.ui.commons.form.Form", multiple : false},
		        }
		    },

			renderer: function(rm, ctrl){
				rm.write("<div");
				rm.writeControlData(ctrl);
				rm.writeAttribute("class", "CustomItemLayout");
				rm.write("><div");
				rm.writeAttribute("class", "CustomItemLayoutInner");
				rm.write("><div");
				rm.writeAttribute("class", "CustomItemLayoutTitle");
				rm.write(">");
				rm.renderControl(ctrl.getImage());
				rm.write("<div>");
				rm.renderControl(ctrl.getLink());
				rm.write("</div></div><div");
				rm.writeAttribute("class", "CustomItemLayoutCntnt");
				rm.write(">");
				rm.renderControl(ctrl.getForm());
				rm.write("</div></div></div>");
		    },
		    
		    onBeforeRendering : function(){
		    	if(this.resizeTimer){
		    		clearTimeout(this.resizeTimer);
		    		this.resizeTimer = null;
		    	}
		    },
		    
		    onAfterRendering : function(){
		    	var $This = this.$();
		    	if($This.parent().parent().hasClass("sapUiUx3DSSVSingleRow")){
		    		this._resize();
		    	}else{
		    		$This.addClass("CustomItemLayoutSmall");
		    	}
		    },
		    
		    _resize: function(){
		    	if(!this.getDomRef()){
		    		return;
		    	}
		    	var $This = this.$();
		    	if($This.outerWidth() >= 440){
		    		$This.removeClass("CustomItemLayoutSmall").addClass("CustomItemLayoutLarge");
		    	}else{
		    		$This.removeClass("CustomItemLayoutLarge").addClass("CustomItemLayoutSmall");
		    	}
		    	setTimeout(jQuery.proxy(this._resize, this), 300);
		    }
		});

		//Initialize the example data and the model
		
		var oModel = this.getModel();
		
		//Initialize the Dataset and the layouts
		function createTemplate(){
			var c = sap.ui.commons;
			return new ItemLayout({
				link: new c.Link({text: "{title}"}),
				form: new c.form.Form({
					width: "100%",
					layout: new c.form.GridLayout(),
					formContainers: [
						new c.form.FormContainer({
							formElements: [
								new c.form.FormElement({
									label: new c.Label({text: "Votes", layoutData: new c.form.GridElementData({hCells: "5"})}),
									fields: [new c.TextField({value: "{count}", editable: false})]
								}),
								new c.form.FormElement({
									label: new c.Label({text: "Rating", layoutData: new c.form.GridElementData({hCells: "5"})}),
									fields: [new c.RatingIndicator({value: Math.floor((Math.random()*5))+1, editable: false})]
								})
							]
						})
					]
				})
			});
		}

		var oDataSet = new sap.ui.ux3.DataSet({
			items: {
				path: "/modelData",
				template: new sap.ui.ux3.DataSetItem({
					title : "{title}"
				})
			},
			views: [
				new sap.ui.ux3.DataSetSimpleView({
					name: "Floating, responsive View",
					icon: "sap-icon://full-stacked-chart",
					floating: true,
					responsive: true,
					itemMinWidth: 200,
					template: createTemplate()
				}),
				new sap.ui.ux3.DataSetSimpleView({
					name: "Single Row View",
					icon: "sap-icon://list",
					floating: false,
					responsive: false,
					itemMinWidth: 0,
					template: createTemplate()
				})
			],
			search: function search(oEvent) {
				var sQuery = oEvent.getParameter("query");
				var oBinding = oDataSet.getBinding("items");
				oBinding.filter(!sQuery ? [] : [new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sQuery)]);
				oDataSet.setLeadSelection(-1);
			},
			selectionChanged: function search(oEvent) {
				var idx = oEvent.getParameter("newLeadSelectedIndex");
				alert("Product '"+oDataSet.getItems()[idx].getTitle()+"' selected.'");
			}
		});
		oDataSet.setModel(oModel);
		return oDataSet;
	}

});