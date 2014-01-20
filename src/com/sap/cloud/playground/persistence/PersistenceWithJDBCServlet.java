package com.sap.cloud.playground.persistence;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.security.core.server.csi.IXSSEncoder;
import com.sap.security.core.server.csi.XSSEncoder;

import org.json.*;


/**
 * Servlet implementation class PersistenceWithJDBCServlet
 */
public class PersistenceWithJDBCServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory
			.getLogger(PersistenceWithJDBCServlet.class);

	private NoteDAO noteDAO;
	private UserDAO userDAO;
       
	/** {@inheritDoc} */
	@Override
	public void init() throws ServletException {
		try {
			InitialContext ctx = new InitialContext();
			DataSource ds = (DataSource) ctx
					.lookup("java:comp/env/jdbc/DefaultDB");
			noteDAO = new NoteDAO(ds);
			userDAO = new UserDAO(ds);
		} catch (SQLException e) {
			throw new ServletException(e);
		} catch (NamingException e) {
			throw new ServletException(e);
		}
	}

	/** {@inheritDoc} */
	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		//response.getWriter().println("<p>Persistence with JDBC!</p>");
		try {
			if(request.getParameter("json") != null && request.getParameter("users") != null){
				//build json
				response.getWriter().print(returnUsersJson(response));
			} else if(request.getParameter("json") != null){
				//build json
				response.getWriter().print(returnJson(response));
			} else {
				appendNoteTable(response);
				appendAddForm(response);
				appendUserTable(response);
			}
			
			
			
			
		} catch (Exception e) {
			response.getWriter().println(
					"Persistence operation failed with reason: "
							+ e.getMessage());
			LOGGER.error("Persistence operation failed", e);
		}
	}

	/** {@inheritDoc} */
	@Override
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		try {
			if(request.getParameter("action").equalsIgnoreCase("add")){
				doAdd(request);
			} else if(request.getParameter("action").equalsIgnoreCase("update")){
				doUpdate(request);
			} else if(request.getParameter("action").equalsIgnoreCase("delete")){
				doDelete(request);
			} else if(request.getParameter("action").equalsIgnoreCase("adduser")){
				doAddUser(request);
			}
			
			doGet(request, response);
		} catch (Exception e) {
			response.getWriter().println(
					"Persistence operation failed with reason: "
							+ e.getMessage());
			LOGGER.error("Persistence operation failed", e);
		}
	}

	private void appendNoteTable(HttpServletResponse response)
			throws SQLException, IOException {
		// Append table that lists all persons
		List<Note> resultList = noteDAO.selectAllNotes();
		response.getWriter().println(
				"<p><table border=\"1\"><tr><th colspan=\"3\">"
						+ (resultList.isEmpty() ? "" : resultList.size() + " ")
						+ "Entries in the Database</th></tr>");
		if (resultList.isEmpty()) {
			response.getWriter().println(
					"<tr><td colspan=\"3\">Database is empty</td></tr>");
		} else {
			response.getWriter()
					.println(
							"<tr><th>Title</th><th>Description</th><th>Count</th><th>Id</th></tr>");
		}
		IXSSEncoder xssEncoder = XSSEncoder.getInstance();
		for (Note p : resultList) {
			response.getWriter().println(
					"<tr><td>" + xssEncoder.encodeHTML(p.getTitle())
							+ "</td><td>"
							+ xssEncoder.encodeHTML(p.getDescription())
							+ "</td><td>"
							+ p.getCount()
							+ "</td><td>" 
							+ p.getId() 
							+ "</td></tr>");
		}
		response.getWriter().println("</table></p>");
	}
	
	private void appendUserTable(HttpServletResponse response)
			throws SQLException, IOException {
		// Append table that lists all persons
		List<User> resultList = userDAO.selectAllUsers();
		response.getWriter().println(
				"<p><table border=\"1\"><tr><th colspan=\"3\">"
						+ (resultList.isEmpty() ? "" : resultList.size() + " ")
						+ "Entries in the Database</th></tr>");
		if (resultList.isEmpty()) {
			response.getWriter().println(
					"<tr><td colspan=\"3\">Database is empty</td></tr>");
		} else {
			response.getWriter()
					.println(
							"<tr><th>Email</th><th>Id</th></tr>");
		}
		IXSSEncoder xssEncoder = XSSEncoder.getInstance();
		for (User p : resultList) {
			response.getWriter().println(
					"<tr><td>" + xssEncoder.encodeHTML(p.getEmail())
							+ "</td><td>"
							+ p.getId() 
							+ "</td></tr>");
		}
		response.getWriter().println("</table></p>");
	}

	private void appendAddForm(HttpServletResponse response) throws IOException {
		// Append form through which new persons can be added
		response.getWriter()
				.println(
						"<p><form action=\"\" method=\"post\">"
								+ "<input type=\"hidden\" name=\"action\" value=\"add\">"
								+ "Title:<input type=\"text\" name=\"title\">"
								+ "&nbsp;Description:<input type=\"text\" name=\"description\">"
								+ "&nbsp;Count:<input type=\"text\" name=\"count\">"
								+ "&nbsp;<input type=\"submit\" value=\"Add Note\">"
								+ "</form></p>");
		
		response.getWriter()
		.println(
				"<p><form action=\"\" method=\"post\">"
						+ "<input type=\"hidden\" name=\"action\" value=\"update\">"
						+ "id:<input type=\"text\" name=\"id\">"
						+ "&nbsp;Count:<input type=\"text\" name=\"count\">"
						+ "&nbsp;<input type=\"submit\" value=\"Update Note\">"
						+ "</form></p>");
		
		response.getWriter()
		.println(
				"<p><form action=\"\" method=\"post\">"
						+ "<input type=\"hidden\" name=\"action\" value=\"adduser\">"
						+ "email:<input type=\"text\" name=\"email\">"
						+ "&nbsp;<input type=\"submit\" value=\"Add User\">"
						+ "</form></p>");
	}
	
	private void doAddUser(HttpServletRequest request) throws ServletException,
	IOException, SQLException {
		// Extract name of person to be added from request
		String email = request.getParameter("email");
		
		// Add person if name is not null/empty
		if (email != null && !email.trim().isEmpty()) {
			User user = new User();
			user.setEmail(email.trim());
			userDAO.addUser(user);;
		}
	}
	
	
	private void doDelete(HttpServletRequest request) throws ServletException,
	IOException, SQLException {
		String id = request.getParameter("id");
		if (id != null && !id.trim().isEmpty() ) {
			noteDAO.deleteNoteById(id);
		}
	}
	
	private void doUpdate(HttpServletRequest request) throws ServletException,
	IOException, SQLException {
		String id = request.getParameter("id");
		String count = request.getParameter("count");
		int icount = 0;
		if (id != null && !id.trim().isEmpty() ) {
			if(count != null && !count.trim().isEmpty()) {
				try 
				{
					icount = Integer.parseInt(count);
				} catch (Exception ex) {
					//gracefully
				}
			}
			else 
			{
				Note note = noteDAO.selectNoteById(id);
				if(note != null){
					icount = note.getCount() + 1;
				} else {
					icount++;
				}
			}
			
			noteDAO.updateCount(id, icount);
		}
	}
	
	private void doAdd(HttpServletRequest request) throws ServletException,
			IOException, SQLException {
		// Extract name of person to be added from request
		String title = request.getParameter("title");
		String description = request.getParameter("description");
		String count = request.getParameter("count");
		int icount = 0;

		// Add person if name is not null/empty
		if (title != null && description != null
				&& !title.trim().isEmpty() && !description.trim().isEmpty()) {
			Note note = new Note();
			note.setTitle(title.trim());
			note.setDescription(description.trim());
			if(count != null && !count.trim().isEmpty()){
				try {
					icount = Integer.parseInt(count);
				} catch (Exception ex) {
					//gracefully
				}
			} 
			note.setCount(icount);
			noteDAO.addNote(note);
		}
	}

	private JSONObject getAddTitle() {
		JSONObject modifiedjson=new JSONObject();
		 modifiedjson.put("id","createTile");
		 modifiedjson.put("type","Create"); //change this one depending on the user.
		 modifiedjson.put("title", "Create Improve Note");
		 modifiedjson.put("description","");
		 modifiedjson.put("count",0);
		 modifiedjson.put("info" , "What can we improve?");
		 modifiedjson.put("infoState" , "Success");
		 modifiedjson.put("icon","sap-icon://add");
		 return modifiedjson;
	}
	
	private String returnJson(HttpServletResponse response)
			throws SQLException, IOException {
		
		// Append table that lists all persons
		List<Note> resultList = noteDAO.selectAllNotes();
		//sort list here
		
		JSONArray ja = new JSONArray();
		//add create tile
		ja.put(getAddTitle());
		
		//create json to each note
		IXSSEncoder xssEncoder = XSSEncoder.getInstance();
		for (Note p : resultList) {
			JSONObject modifiedjson=new JSONObject();
			 modifiedjson.put("id",p.getId());
			 modifiedjson.put("type","None"); //change this one depending on the user.
			 modifiedjson.put("title", p.getTitle());
			 modifiedjson.put("description",p.getDescription());
			 modifiedjson.put("count",p.getCount());
			 modifiedjson.put("info" , p.getInfo());
			 modifiedjson.put("infoState" , p.getInfoState());
			 modifiedjson.put("icon",p.getIcon());
			 ja.put(modifiedjson);
		}
		
		JSONObject root = new JSONObject();
		root.put("modelData",ja);
		
		return root.toString();
	}
	
	private String returnUsersJson(HttpServletResponse response)
			throws SQLException, IOException {
		
		// Append table that lists all persons
		List<User> resultList = userDAO.selectAllUsers();
		//sort list here
		
		JSONArray ja = new JSONArray();
		
		//create json to each user
		for (User p : resultList) {
			JSONObject modifiedjson=new JSONObject();
			 modifiedjson.put("id",p.getId());
			 modifiedjson.put("email", p.getEmail());
			 ja.put(modifiedjson);
		}
		
		JSONObject root = new JSONObject();
		root.put("modelData",ja);
		
		return root.toString();
	}
}
