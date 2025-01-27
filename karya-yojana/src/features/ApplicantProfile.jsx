import React, { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Assuming you have a UserContext
import PhotoUpload from "./PhotoUpload";

const ApplicantProfile = () => {
    const { userId } = useContext(UserContext); // Get userId from context

    return (
        <PhotoUpload userId={userId} />
    );
}

export default ApplicantProfile;
