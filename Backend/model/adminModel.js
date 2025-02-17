import {pool} from "../config/db.js"; // Import the database connection

export const updateJobStatus = async (jobId, status) => {
    const query = `
        UPDATE jobs_posting 
        SET status = $1 
        WHERE id = $2 
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [status, jobId]);
        return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
};
