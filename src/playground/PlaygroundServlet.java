package playground;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.util.Enumeration;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
	
/**
 * Servlet implementation class PlaygroundServlet
 */
public class PlaygroundServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private PrintWriter out = null;
    /**
     * Default constructor. 
     */
    public PlaygroundServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		out = response.getWriter();
        
    try {
    	out.println("n-ACTION");
		if(request.getParameter("action") != null) {
			out.println("ACTION : "+request.getParameter("action"));
			out.println("ACTION : "+request.getParameter("title"));
			out.println("ACTION : "+request.getParameter("description"));
			if(request.getParameter("action").toLowerCase().trim() == "add" && request.getParameter("title") != null && request.getParameter("description") != null){
				out.println("ACTION: ADD");
				AddEntry(request.getParameter("title"),request.getParameter("description"));
			}
		}
		
		out.println(getStringDB(getUrlDBFile()));
		
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
        out.close();	
	}
	
	private String getUrlDBFile() {
		 String fName = "/db.json";
	     String url = this.getServletContext().getRealPath(fName);
	     return url;
	}
	
	private String getStringDB(String url) throws Exception {
		ServletContext cntxt = this.getServletContext();
        //InputStream ins = cntxt.getResourceAsStream(fName);

	     InputStream ins = new FileInputStream(url);
        String json = "";
        try {
            if (ins != null) {
                InputStreamReader isr = new InputStreamReader(ins);
                BufferedReader reader = new BufferedReader(isr);
                int n = 0;
                String word = "";
                while ((word = reader.readLine()) != null) {
                    //n = Integer.parseInt(word);
                    
                    json = json+word;
                }
            }
        }
        catch(Exception ex) { 
        	throw new Exception(ex);
        }finally {
        	
        }
        
        return json;
	}
	
	private boolean AddEntry(String title, String description) {
		
		try {
			JSONObject object=new JSONObject(getStringDB(getUrlDBFile()));
			JSONArray jsonMainArr = object.getJSONArray("modelData"); 
			// out.println("printing ids before");
			// out.println(object.toString(1));
			 /*for (int i = 0; i < jsonMainArr.length(); i++) {  // **line 2**
			     JSONObject childJSONObject = jsonMainArr.getJSONObject(i);
			     String name = childJSONObject.getString("id");
			     out.println(name);
			 }*/
			 JSONObject modifiedjson=new JSONObject();
			 modifiedjson.put("id","tileId"+jsonMainArr.length());
			 modifiedjson.put("type","Monitor"); //change this one depending on the user.
			 modifiedjson.put("title", title);
			 modifiedjson.put("description",description);
			 modifiedjson.put("count","1");
			 modifiedjson.put("info" , "Not much interest yet");
			 modifiedjson.put("icon","sap-icon://favorite");
			 jsonMainArr.put(modifiedjson);
			 
			// out.println("printing ids after");
			// out.println(object.toString(1));

		     String fName = "/db.json";
		     String url = this.getServletContext().getRealPath(fName);
		    // System.out.println(url);
		     out.println(url);
		     File file = new File(url);
		     FileWriter fout = new FileWriter(file);
		     fout.write(object.toString(1));
		     fout.close();
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return true;
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}
	
	
}
