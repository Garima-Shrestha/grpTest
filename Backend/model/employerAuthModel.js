import {pool} from '../config/db.js';

export const createEmployer = async (companyName, email, password, contact, address, panNumber, companyType, role, companyDesc, photoPath) => {
    try {
      const query = `INSERT INTO employers(company_name, email, password, contact, address, pan_number, company_type, role) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, company_name, email, role`;
      const values = [companyName, email, password, contact, address, panNumber, companyType, role];
      const result = await pool.query(query, values);
      const employerId = result.rows[0].id;
  
      // Insert profile data
      const profileQuery = `INSERT INTO employer_profiles(employer_id, company_desc, photo) VALUES ($1, $2, $3) RETURNING *`;
      const profileValues = [employerId, companyDesc, photoPath]; // Store file path
      const profileResult = await pool.query(profileQuery, profileValues);
  
      return { employer: result.rows[0], profile: profileResult.rows[0] };
    } catch (error) {
      console.error("Error creating employer:", error);
      throw new Error(process.env.NODE_ENV === "production" ? "Database error during employer creation" : error.message);
    }
  };
  
export const findEmployerEmail = async (email) => {
    const query = `SELECT employers.*, employer_profiles.company_desc, employer_profiles.photo 
                   FROM employers 
                   LEFT JOIN employer_profiles 
                   ON employers.id = employer_profiles.employer_id 
                   WHERE employers.email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  };
  
export const getEmployerById = async (id) => {
  const query = `
      SELECT employers.*, employer_profiles.company_desc, employer_profiles.photo 
      FROM employers 
      LEFT JOIN employer_profiles ON employers.id = employer_profiles.employer_id 
      WHERE employers.id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0]; // Return employer object or undefined if not found
};

export const updateEmployerById = async (id, data) => {
    const { name, email, phoneNumber, companyType, panNumber, companyDesc, photoPath } = data;
    
    // Update employers table
    const employerQuery = `
      UPDATE employers 
      SET company_name = $1, email = $2, contact = $3, company_type = $4, pan_number = $5
      WHERE id = $6 RETURNING *`;
    const employerValues = [name, email, phoneNumber, companyType, panNumber, id];
    const employerResult = await pool.query(employerQuery, employerValues);
    
    // Update employer_profiles table
    let profileResult;
    const updateProfileQuery = `
      UPDATE employer_profiles 
      SET company_desc = $1, photo = COALESCE($2, photo)
      WHERE employer_id = $3 RETURNING *`;
    const updateProfileValues = [companyDesc, photoPath, id];
    profileResult = await pool.query(updateProfileQuery, updateProfileValues);

    // Insert new profile if none exists
    if (profileResult.rowCount === 0) {
      const insertProfileQuery = `
        INSERT INTO employer_profiles (employer_id, company_desc, photo)
        VALUES ($1, $2, $3)
        RETURNING *`;
      const insertProfileValues = [id, companyDesc, photoPath];
      profileResult = await pool.query(insertProfileQuery, insertProfileValues);
    }
    
    return { ...employerResult.rows[0], ...profileResult.rows[0] };
  };

export const deleteEmployerById = async (id) => {
  const query = `DELETE FROM employers WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [id]);
  return rows[0]; // Return deleted employer object
};

