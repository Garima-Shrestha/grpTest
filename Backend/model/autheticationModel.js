import {pool} from '../config/db.js';

export const createUser = async(username, email, password, contactNumber, gender) => {
    try {
        const query = `INSERT INTO users (username, email, password, contact_number, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const values = [username, email, password, contactNumber, gender];
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
    return rows[0];
}