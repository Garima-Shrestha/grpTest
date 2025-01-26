import {pool} from '../config/db.js';

export const createEmployer = async (companyName, email, password, contact, address, panNumber, companyType) =>{
    try{
        const query = `INSERT INTO employers(company_name, email, password, contact, address, pan_number, company_type) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [companyName, email, password, contact, address, panNumber, companyType];
        const result= await pool.query(query,values);
        return result.rows[0];
    }catch(error){
        console.error('Error creating employers:', error); 
        throw new Error(process.env.NODE_ENV === 'production' ? 'Database error during user creation' : error.message);
    }
}; 
export const findEmployerEmail = async(email) => {
    const query = `SELECT * FROM employers WHERE email = $1`;
    const {rows} = await pool.query(query ,[email]);
    return rows[0];
}
