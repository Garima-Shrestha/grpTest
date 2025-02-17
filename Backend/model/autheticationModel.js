import {pool} from '../config/db.js';

export const createUser = async(username, email, password, contactNumber, gender, role) => {
    try {
        const query = `INSERT INTO users (username, email, password, contact_number, gender, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
        const values = [username, email, password, contactNumber, gender, role];
        const result = await pool.query(query, values);
        return result.rows[0];
    }catch(error){
        console.error('Error creating user:', error); 
        throw new Error (process.env.NODE_ENV === 'production' ? 'Database error during user creation' : error.message);
    }
};
export const findEmail = async(email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const {rows} = await pool.query(query, [email]);
    console.log("findEmail - User found:", rows[0]);
    return rows[0];
}



//For Managing Account i.e. deleting account
export const deleteAccount  = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};





//Admin Page (Fetching Applicant)
export const getAllUsers = async () => {
    try {
      const result = await pool.query('SELECT id, username, email, gender, contact_number, role FROM users WHERE role = $1', ['applicant']);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  };



  //Admin Page (Updating Applicant)
  // In userModel.js
  export const updateUser = async (id, userData) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;
  
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
  
    if (fields.length === 0) throw new Error("No fields to update");
  
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  };



//Admin Page (Deleting Applicant)
export const deleteAccountIndv = async (userId) => {              //Deletes a user with the given userId from the users table and returns the deleted user's data.
  const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};




//Admin Dashboard Showing total number of applicant
export const getTotalUsersCount = async () => {
  const query = 'SELECT COUNT(*) FROM users WHERE role != $1';  // Exclude admin users
  const result = await pool.query(query, ['admin']);
  return result.rows[0].count;
};
