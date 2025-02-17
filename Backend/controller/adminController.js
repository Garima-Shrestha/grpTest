import { updateJobStatus } from "../model/adminModel.js";

export const updateJobStatusController = async (req, res) => {
    const { jobId } = req.params;
    const { status } = req.body;
    try {
        const updatedJob = await updateJobStatus(jobId, status);
        
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found." });
        }

        res.json({ message: "Job status updated.", job: updatedJob });
    } catch (error) {
        console.error("Error updating job status:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
