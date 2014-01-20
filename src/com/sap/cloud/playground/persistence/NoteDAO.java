package com.sap.cloud.playground.persistence;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.sql.DataSource;


/**
 * Data access object encapsulating all JDBC operations for a Note.
 */
public class NoteDAO {
	 private DataSource dataSource;
	 
	 /**
	     * Create new data access object with data source.
	     */
	    public NoteDAO(DataSource newDataSource) throws SQLException {
	        setDataSource(newDataSource);
	    }

	    /**
	     * Get data source which is used for the database operations.
	     */
	    public DataSource getDataSource() {
	        return dataSource;
	    }

	    /**
	     * Set data source to be used for the database operations.
	     */
	    public void setDataSource(DataSource newDataSource) throws SQLException {
	        this.dataSource = newDataSource;
	        checkTable();
	    }

	    /**
	     * Add a person to the table.
	     */
	    public void addNote(Note note) throws SQLException {
	        Connection connection = dataSource.getConnection();

	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("INSERT INTO NOTES (ID, TITLE, DESCRIPTION, COUNT) VALUES (?, ?, ?, ?)");
	            pstmt.setString(1, UUID.randomUUID().toString());
	            pstmt.setString(2, note.getTitle());
	            pstmt.setString(3, note.getDescription());
	            pstmt.setInt(4, note.getCount());
	            pstmt.executeUpdate();
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }
	    
	    public void updateCount(String id, int count) throws SQLException {
	    	Connection connection = dataSource.getConnection();

	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("UPDATE NOTES SET COUNT=? WHERE ID=?");
	            pstmt.setInt(1, count);
	            pstmt.setString(2, id);
	     
	            pstmt.executeUpdate();
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }
	    
	    public void deleteNoteById(String id) throws SQLException {
	    	Connection connection = dataSource.getConnection();

	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("DELETE FROM NOTES WHERE ID=?");
	            pstmt.setString(1, id);
	     
	            pstmt.executeUpdate();
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }
	    
	    public Note selectNoteById(String id) throws SQLException {
	    	 System.out.println("DAO : "+id);
	        Connection connection = dataSource.getConnection();
	        Note p = null;
	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("SELECT ID, TITLE, DESCRIPTION, COUNT FROM NOTES WHERE ID = '"+id+"'");
	            ResultSet rs = pstmt.executeQuery();
	            //pstmt.setString(1, id);
	            System.out.println("iterate");
	            while (rs.next()) {
	            	System.out.println("row");
	            	p = new Note();
	                p.setId(rs.getString(1));
	                p.setTitle(rs.getString(2));
	                p.setDescription(rs.getString(3));
	                p.setCount(rs.getInt(4));
	                break;
	            }
	            
	        } catch( Exception ex) {
	        	ex.printStackTrace();
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	        return p;
	    }
	    
	    /**
	     * Get all persons from the table.
	     */
	    public List<Note> selectAllNotes() throws SQLException {
	        Connection connection = dataSource.getConnection();
	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("SELECT ID, TITLE, DESCRIPTION, COUNT FROM NOTES");
	            ResultSet rs = pstmt.executeQuery();
	            ArrayList<Note> list = new ArrayList<Note>();
	            while (rs.next()) {
	            	Note p = new Note();
	                p.setId(rs.getString(1));
	                p.setTitle(rs.getString(2));
	                p.setDescription(rs.getString(3));
	                p.setCount(rs.getInt(4));
	                list.add(p);
	            }
	            return list;
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }

	    /**
	     * Check if the person table already exists and create it if not.
	     */
	    private void checkTable() throws SQLException {
	        Connection connection = null;

	        try {
	            connection = dataSource.getConnection();
	            if (!existsTable(connection)) {
	                createTable(connection);
	            }
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }

	    /**
	     * Check if the person table already exists.
	     */
	    private boolean existsTable(Connection conn) throws SQLException {
	        DatabaseMetaData meta = conn.getMetaData();
	        ResultSet rs = meta.getTables(null, null, "NOTES", null);
	        while (rs.next()) {
	            String name = rs.getString("TABLE_NAME");
	            if (name.equals("NOTES")) {
	                return true;
	            }
	        }
	        return false;
	    }

	    /**
	     * Create the person table.
	     */
	    private void createTable(Connection connection) throws SQLException {
	        PreparedStatement pstmt = connection
	                .prepareStatement("CREATE TABLE NOTES "
	                        + "(ID VARCHAR(255) PRIMARY KEY, "
	                        + "TITLE VARCHAR (255),"
	                        + "DESCRIPTION VARCHAR (255),"
	        				+ "COUNT INT)");
	        pstmt.executeUpdate();
	    }
}
