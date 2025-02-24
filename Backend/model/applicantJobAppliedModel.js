import { pool } from "../config/db.js";

export const createJobApplication = async (userId, jobId) => {
    try {
        const query = 'INSERT INTO job_applications (user_id, job_id) VALUES ($1, $2) RETURNING *'
        const values = [userId, jobId];
        const result = await pool.query(query, values);
        console.log("Job application created:", result.rows[0]);
        return result.rows[0]; 
    } catch (error) {
        console.error("Error creating job application:", error);
        throw new Error("Error creating job application");
    }
};

// Function to find an application by user ID and job ID
export const findApplicationByUserAndJob = async (userId, jobId) => {
    try {
        const query = 'SELECT * FROM job_applications WHERE user_id = $1 AND job_id = $2';
        const values = [userId, jobId];
        const result = await pool.query(query, values);
        console.log("Found application:", result.rows);
        return result.rows; 
    } catch (error) {
        console.error("Error finding job application:", error);
        throw new Error("Error finding job application");
    }
};

// Function to fetch all applications for a specific user
export const fetchUserApplications = async (userId) => {
    try {
        const query = `
            SELECT 
                job_applications.id,
                job_applications.job_id,
                job_applications.application_date,
                jobs_posting.title,
                jobs_posting.salary,
                employers.company_name AS company,
                jobs_posting.position AS vacancy_for
            FROM 
                job_applications
            JOIN 
                jobs_posting ON job_applications.job_id = jobs_posting.id
            JOIN
                employers ON jobs_posting.employer_id = employers.id
            WHERE 
                job_applications.user_id = $1
        `;
        const values = [userId];
        const result = await pool.query(query, values);
        console.log("Fetched user applications:", result.rows);
        return result.rows; 
    } catch (error) {
        console.error("Error fetching user applications:", error);
        throw new Error("Error fetching user applications");
    }
};
