package com.sap.cloud.playground.persistence;

public class Note {
	 	private String id;
	    private String title;
	    private String description;
	    private String type;
	    private int count;
	    private String info;
	    private String infoState;
	    private String Icon;
	    
	    public String getId() {
	        return id;
	    }

	    public void setId(String newId) {
	        this.id = newId;
	    }

	    public String getTitle() {
	        return this.title;
	    }

	    public void setTitle(String newtitle) {
	        this.title = newtitle;
	    }

	    public String getDescription() {
	        return this.description;
	    }

	    public void setDescription(String newDesc) {
	        this.description = newDesc;
	    }

	    public int getCount() {
			return count;
		}

	    public void setCount(int count) {
			this.count = count;
		}

	    public String getInfo() {
	    	if(this.count < 30) {
	    		return "Not much interest yet";
	    	} else if(this.count < 60) {
	    		return "Worth taking a look";
	    	} else {
	    		return "Urgent";
	    	}
		}

	    public String getInfoState() {
	    	if(this.count < 30) {
	    		return "None";
	    	} else if(this.count < 60) {
	    		return "Warning";
	    	} else {
	    		return "Error";
	    	}
		}

	    public String getIcon() {
	    	return "sap-icon://favorite";
		}
}
