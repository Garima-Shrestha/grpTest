import { createJobApplication, findApplicationByUserAndJob, fetchUserApplications } from '../model/applicantJobAppliedModel.js';

// Controller to handle job application
export const applyForJob = async (req, res) => {
    const userId = req.user.id;
    const { jobId } = req.body;

    try {
        // Check if the user has already applied for this job
        const existingApplication = await findApplicationByUserAndJob(userId, jobId);
        if (existingApplication.length > 0) {
            return res.status(400).json({ message: "Already applied." });
        }

        // Create a new job application
        const newApplication = await createJobApplication(userId, jobId);
        res.status(201).json({ message: "Application submitted!", application: newApplication });
    } catch (error) {
        console.error("Error applying:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Controller to fetch applications for a specific user
export const getUserApplications = async (req, res) => {
    const userId = req.user.id; 

    try {
        const applications = await fetchUserApplications(userId);
        res.json(applications);
    } catch (error) {
        console.error("Error fetching user applications:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};