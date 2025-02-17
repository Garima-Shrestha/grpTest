import { pool } from "../config/db.js";

// Create Job Posting
export const createJob = async (title, deadline, salary, position, description, qualifications, employerId, transaction) => {

    try {
        // Insert job posting into database
        const query = `
            INSERT INTO jobs_posting (title, deadline, salary, position, description, qualifications, employer_id, transaction)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const values = [title, deadline, salary, position, description, qualifications, employerId, transaction];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.error("Error posting jobs:", error);
        throw new Error("Error posting jobs");
    }
};

export const isTransactionValid = async(transaction)=>{
    const query = 'SELECT COUNT(*) FROM jobs_posting WHERE transaction = $1';
        const result = await pool.query(query, [transaction]);

        return parseInt(result.rows[0].count, 10) < 10; 
};
export const getSingleJobPosting = async (id) => {
    const query = `
      SELECT 
        jobs_posting.*,
        employers.company_name AS employer_name,
        employers.contact AS employer_contact,
        employers.email AS employer_email,
        employers.address AS employer_address,
        employer_profiles.photo AS employer_profile_picture
      FROM jobs_posting
      JOIN employers ON employers.id = jobs_posting.employer_id
      LEFT JOIN employer_profiles ON employer_profiles.employer_id = employers.id
      WHERE jobs_posting.id = $1;
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching Job Posting with employer details:', error);
      throw error;
    }
  };
  export const getJobPosting  = async () => {
    const query = `
      SELECT 
        jobs_posting.*,
        employers.company_name AS employer_name,
        employers.contact AS employer_contact,
        employers.email AS employer_email,
        employers.address AS employer_address,
        employer_profiles.photo AS employer_profile_picture
      FROM jobs_posting
      JOIN employers ON employers.id = jobs_posting.employer_id
      LEFT JOIN employer_profiles ON employer_profiles.employer_id = employers.id;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all Job Postings with employer details:', error);
      throw error;
    }
  };
  