jQuery.sap.declare("view.control.FavoriteButton");
sap.m.MessageBox.Action.OK.extend("view.control.FavoriteButton", {
	 properties : {           // setter and getter are created behind the scenes, incl. data binding and type validation
         "text" : "string"     // in simple cases, just define the type
      }
});
