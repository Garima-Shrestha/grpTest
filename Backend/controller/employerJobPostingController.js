import { findTransactionById, createTransaction, updateJobPostCount, transactionLimit, createJob } from "../model/employerJobPostingModel.js";


// fetching all jobs
// export const fetchJobs = async (req, res) => {
//     try {
//         const jobs = await getAllJobs();
//         res.status(200).json({ jobs });
//     } catch (error) {
//         console.error('Error fetching jobs:', error);
//         res.status(500).json({ message: "Server Error", error });
//     }
// };




export const postJob = async (req, res) => {
    try {
        const employerId = req.user.id; 
        let { title, deadline, salary, position, description, qualifications, transactionId } = req.body;

        // Transaction Id xa ki xaina check
        // let transaction = await findTransactionById(transactionId);
        // if (!transaction) {
        //     transaction = await createTransaction();  // Creating a new transaction if not found
        //     transactionId = transaction.transaction_id;  // Assign the new transaction ID
        //     if (!transaction) {
        //         return res.status(500).json({ error: 'Failed to create a transaction' });
        //     }
        // }



        let transaction = null;

if (transactionId) {
    transaction = await findTransactionById(transactionId);
}

if (!transaction) {
    transactionId = transaction.transaction_id;
} else {
    transactionId = transaction.transaction_id;
}




        // Check if transaction limit exceed or not (10 posts) 
        const limitExceeded = await transactionLimit(transaction.transaction_id);  // Using the auto-generated transaction_id
        if (limitExceeded) {
            return res.status(400).json({ error: 'Transaction limit exceeded. You cannot post more than 10 jobs with the same transaction ID.' });
        }

        
        // Update the job post count for the transaction
        const updatedTransaction = await updateJobPostCount(transaction.transaction_id);  // Using the auto-generated transaction_id
        if (!updatedTransaction) {
            return res.status(500).json({ error: 'Failed to update job post count' });
        }

        const job = await createJob(title, deadline, salary, position, description, qualifications, employerId, transactionId);
        if (!job) {
            return res.status(500).json({ error: 'Failed to post jobs' });
        }
        console.log('Job created:', job);
        res.status(201).json({ message: 'Job Posted successfully', job });

    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: "Server Error", error });
    }
};
