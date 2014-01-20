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
public class UserDAO {
	 private DataSource dataSource;
	 
	 /**
	     * Create new data access object with data source.
	     */
	    public UserDAO(DataSource newDataSource) throws SQLException {
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
	    public void addUser(User user) throws SQLException {
	        Connection connection = dataSource.getConnection();

	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("INSERT INTO USERS (ID, EMAIL) VALUES (?, ?)");
	            pstmt.setString(1, UUID.randomUUID().toString());
	            pstmt.setString(2, user.getEmail());
	            pstmt.executeUpdate();
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }
	    
	    public void deleteUserById(String id) throws SQLException {
	    	Connection connection = dataSource.getConnection();

	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("DELETE FROM USERS WHERE ID=?");
	            pstmt.setString(1, id);
	     
	            pstmt.executeUpdate();
	        } finally {
	            if (connection != null) {
	                connection.close();
	            }
	        }
	    }
	    
	    public User selectUserById(String id) throws SQLException {
	    	 System.out.println("DAO : "+id);
	        Connection connection = dataSource.getConnection();
	        User p = null;
	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("SELECT ID, EMAIL FROM USERS WHERE ID = '"+id+"'");
	            ResultSet rs = pstmt.executeQuery();
	            //pstmt.setString(1, id);
	            System.out.println("iterate");
	            while (rs.next()) {
	            	System.out.println("row");
	            	p = new User();
	                p.setId(rs.getString(1));
	                p.setEmail(rs.getString(2));
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
	    public List<User> selectAllUsers() throws SQLException {
	        Connection connection = dataSource.getConnection();
	        try {
	            PreparedStatement pstmt = connection
	                    .prepareStatement("SELECT ID, EMAIL FROM USERS");
	            ResultSet rs = pstmt.executeQuery();
	            ArrayList<User> list = new ArrayList<User>();
	            while (rs.next()) {
	            	User p = new User();
	                p.setId(rs.getString(1));
	                p.setEmail(rs.getString(2));

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
	        ResultSet rs = meta.getTables(null, null, "USERS", null);
	        while (rs.next()) {
	            String name = rs.getString("TABLE_NAME");
	            if (name.equals("USERS")) {
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
	                .prepareStatement("CREATE TABLE USERS "
	                        + "(ID VARCHAR(255) PRIMARY KEY, "
	                        + "EMAIL VARCHAR (255))");
	        pstmt.executeUpdate();
	    }
}
