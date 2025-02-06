import { pool } from "../config/db.js";

export const createJob = async (title, deadline, salary, position, description, qualifications, employerId, transactionId) => {

    // Check if the transaction has reached the limit (10 jobs)
    const limitExceeded = await transactionLimit(transactionId);
        if (limitExceeded) {
            console.log("Transaction limit exceeded. Cannot create more jobs.");
            return null;  // Or throw an error if you prefer
        }

        // If limit not exceeded, update job post count and create job
        await updateJobPostCount(transactionId);

    try {
        const query = `
            INSERT INTO jobs_posting (title, deadline, salary, position, description, qualifications, employer_id, transaction)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const values = [title, deadline, salary, position, description, qualifications, employerId, transactionId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error posting jobs:', error); 
        throw new Error('Error posting jobs');
    }
};




// export const getAllJobs = async () => {
//     const { rows } = await pool.query("SELECT * FROM jobs_posting ORDER BY created_at DESC");
//     return rows;
// };





//transaction id xa ki xaina herxa, if xa then transaction details return garxa, if xaina then undefined return garxa
export const findTransactionById = async (transactionId) => {
    try {
        const query = `SELECT * FROM job_posting_transactions WHERE transaction_id = $1;`;
        const values = [transactionId];
        const result = await pool.query(query, values);

        console.log('Fetched Transaction:', result.rows[0]); // Debugging

        return result.rows[0];
    } catch (error) {
        console.error('Error finding transaction:', error);
        throw new Error('Error finding transaction'); 
    }
};



// To create a new transaction, job post count 1 bata initialize hunxa
export const createTransaction = async () => {
    try {
        const query = `
            INSERT INTO job_posting_transactions (job_post_count)
            VALUES ($1) RETURNING *;
        `;
        const values = [1]; 
        const result = await pool.query(query, values);

        console.log('Created Transaction:', result.rows[0]); // Debugging

        return result.rows[0]; 
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw new Error('Error creating transaction');
    }
};




// job post count update for a specific transaction
export const updateJobPostCount = async (transactionId) => {
    try {
        const query = `
            UPDATE job_posting_transactions
            SET job_post_count = job_post_count + 1
            WHERE transaction_id = $1
            RETURNING *;
        `;
        const values = [transactionId];
        console.log('Executing query to update job post count with values:', values); // Added logging
        const result = await pool.query(query, values);
        console.log('Result after updating job post count:', result.rows[0]); // Added logging
        return result.rows[0];
    } catch (error) {
        console.error('Error incrementing job post count:', error);
        throw new Error('Error incrementing job post count');
    }
};






// to check transaction limit exceed xa ki xaina (10 posts) 
export const transactionLimit = async (transactionId) => {
    try {
        const query = `SELECT job_post_count FROM job_posting_transactions WHERE transaction_id = $1;`;
        const values = [transactionId];
        const result = await pool.query(query, values);

        console.log('Transaction Limit Check:', result.rows[0]); // Debugging

        if (result.rows.length === 0) return false;                    // No transaction found
        return result.rows[0].job_post_count >= 10;                    // Returns true if job post count exceeds 10
    } catch (error) {
        console.error('Error checking transaction limit:', error);
        throw new Error('Error checking transaction limit');
    }
};