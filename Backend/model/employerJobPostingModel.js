import { pool } from "../config/db.js";

// Create Job Posting
export const createJob = async (title, deadline, salary, position, description, qualifications, employerId, transactionId) => {
    try {
        // Insert job posting into database
        const query = `
            INSERT INTO jobs_posting (title, deadline, salary, position, description, qualifications, employer_id, transaction)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const values = [title, deadline, salary, position, description, qualifications, employerId, transactionId];
        const result = await pool.query(query, values);

        // If job is created successfully, update transaction count
        if (result.rows.length > 0) {
            await updateJobPostCount(transactionId);
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error posting jobs:", error);
        throw new Error("Error posting jobs");
    }
};

export const isTransactionValid = async(transactionId)=>{
    const query = 'SELECT COUNT(*) FROM jobs_posting WHERE transaction = $1';
        const result = await pool.query(query, [transactionId]);

        return parseInt(result.rows[0].count, 10) < 10; 
};