import React, { useState } from "react";
import "../css/accountManage.css";
import { useNavigate } from "react-router-dom";

const ManageAccount = () => {
  const [reason, setReason] = useState("");
  const [foundJob, setFoundJob] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      // Get the token
      const token = localStorage.getItem("token");

      if (!token) {
        setErrors({ general: "No token found. Please log in again." });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/appManageAcc", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          // body: JSON.stringify({ reason, foundJob, feedback }),
        });

        if (response.ok) {
          console.log("Your account has been deleted successfully.");
          navigate("/login");
        } else {
          const data = await response.text();  // Log raw text for debugging
          setErrors({ general: `Failed to delete account: ${data}` });
        }        
      } catch (error) {
        console.error("Error deleting account:", error);
        setErrors({ general: "An error occurred while deleting your account." });
      }
    } else {
      setErrors({ general: "Account deletion canceled." });
    }
  };

  return (
    <div className="accountManage">
      <div className="account-container">
        <h2 className="account-title">Delete Account</h2>
        <form className="account-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group-acc">
            <label htmlFor="reason" className="form-label">
              Why are you deleting your account?
            </label>
            <select
              id="reason"
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">-- Select a Reason --</option>
              <option value="Privacy Concerns">Privacy Concerns</option>
              <option value="Not Useful">Not Useful</option>
              <option value="Switching to Another Service">
                Switching to Another Service
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group-acc">
            <p className="form-radio-label">Did you find your dream job?</p>
            <label className="form-radio-option">
              <input
                type="radio"
                name="dreamJob"
                value="Yes"
                checked={foundJob === "Yes"}
                onChange={(e) => setFoundJob(e.target.value)}
                required
              />
              Yes
            </label>
            <br />
            <label className="form-radio-option">
              <input
                type="radio"
                name="dreamJob"
                value="No"
                checked={foundJob === "No"}
                onChange={(e) => setFoundJob(e.target.value)}
                required
              />
              No
            </label>
          </div>

          <div className="form-group-acc">
            <label htmlFor="feedback" className="form-label">
              Additional Feedback (optional):
            </label>
            <textarea
              id="feedback"
              className="form-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
            />
          </div>

          {errors.general && <span className="error-message-register">{errors.general}</span>}<br></br>

          <button
            type="submit"
            className="form-submit-button"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;
