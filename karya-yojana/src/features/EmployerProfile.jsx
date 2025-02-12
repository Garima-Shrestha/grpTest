import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "../css/employerprofile.css";
import 'react-quill/dist/quill.snow.css'; // Import Quill's default style

const EmployerProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit modes

  useEffect(() => {
    fetchEmployerProfile();
  }, []);

  const fetchEmployerProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/employer/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfileData(data.profile);
          setName(data.profile.company_name);
          setEmail(data.profile.email);
          setPhoneNumber(data.profile.contact);
          setCompanyType(data.profile.company_type);
          setPanNumber(data.profile.pan_number);
          setCompanyDesc(data.profile.company_desc);
          setPhotoPreview(data.profile.photo ? `http://localhost:3000${data.profile.photo}` : null);
        } else {
          setErrorMessage("No profile found.");
        }
      } else {
        setErrorMessage("Error fetching employer profile: " + response.statusText);
      }
    } catch (error) {
      setErrorMessage("Request failed: " + error.message);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("companyType", companyType);
    formData.append("panNumber", panNumber);
    formData.append("companyDesc", companyDesc);
    if (photo) formData.append("photo", photo);

    try {
      const response = await fetch("http://localhost:3000/api/employer/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        setErrorMessage("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode after saving
      } else {
        const errorData = await response.json();
        setErrorMessage("Error: " + errorData.message);
      }
    } catch (error) {
      setErrorMessage("Request failed: " + error.message);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/employer/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        window.location.reload();
        setProfileData(null);
        setErrorMessage("Profile deleted successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage("Error: " + errorData.message);
      }
    } catch (error) {
      setErrorMessage("Request failed: " + error.message);
    }
  };
  const handlePhotoButtonClick = () => {
    document.getElementById('photo-input').click(); // Trigger file input on button click
  };
  return (
    <div className="employer-profile-empProfile">
      <h1>Employer Profile</h1>
      {errorMessage && <p className="error-message-empProfile">{errorMessage}</p>}

      <div className="profile-container-empProfile">
        {/* Show form if data is missing or we're in editing mode */}
        {(isEditing || !profileData?.company_desc || !profileData?.photo) ? (
          <div className="profile-form-empProfile">
            <div className="form-group-empProfile">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group-empProfile">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group-empProfile">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group-empProfile">
              <label htmlFor="companyType">Company Type</label>
              <select id="companyType" value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
                <option value="">Select your company type</option>
                <option value="Private">Private</option>
                <option value="NGO/INGO">NGO/INGO</option>
              </select>
            </div>
            <div className="form-group-empProfile">
              <label htmlFor="panNumber">PAN Number</label>
              <input
                id="panNumber"
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="Enter your PAN number"
              />
            </div>
            <div className="form-group-empProfile">
              <label htmlFor="companyDesc">Company Description</label>
              <ReactQuill
                value={companyDesc}
                onChange={setCompanyDesc}
                placeholder="Describe your company"
              />
            </div>
            <div className="form-group-empProfile image-upload-empProfile">
              <label htmlFor="photo">Profile Picture</label>
              <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  className="file-input-empProfile"
                  onChange={handlePhotoChange}
                />
                {/* Custom button */}
                <button
                  type="button"
                  onClick={handlePhotoButtonClick}
                  className="custom-file-upload-button"
                >
                  Choose a File
                </button>

              {photoPreview && (
                <div className="image-preview-empProfile">
                  <img src={photoPreview} alt="Preview" />
                </div>
              )}
            </div>

            <button onClick={handleSave} className="save-button-empProfile">
              Save Profile
            </button>
          </div>
        ) : (
          // Display profile if not in editing mode
          <div className="profile-display-empProfile">
            <h2>Your Profile</h2>
            {profileData && (
              <div className="profile-info-empProfile">
                <div className="profile-photo-empProfile">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Company" />
                  ) : (
                    <div className="photo-placeholder-empProfile">No Photo</div>
                  )}
                </div>
                <p><strong>Name:</strong> {profileData.company_name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone Number:</strong> {profileData.contact}</p>
                <p><strong>Company Type:</strong> {profileData.company_type}</p>
                <p><strong>PAN Number:</strong> {profileData.pan_number}</p>
                <p><strong>Company Description:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: profileData.company_desc }} />
              </div>
            )}
            <button onClick={() => setIsEditing(true)} className="edit-button-empProfile">
              Edit Profile
            </button>
            <button onClick={handleDelete} className="delete-button-empProfile">
              Delete Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;
