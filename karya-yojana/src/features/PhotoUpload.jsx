import React, { useState, useEffect } from 'react';

const ProfileForm = ({ authToken }) => {
  // Initial form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    education: '',
    bio: '',
    experience: '',
    certifications: '',
    skills: '',
    reference: '',
    profilePicture: null,
  });

  const [isUpdating, setIsUpdating] = useState(false); // Check if the user is updating
  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));
  };

  // Fetch profile data if updating
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/protected/resume/profileApplicant', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFormData(data); // Pre-fill the form with the existing profile data
          setIsUpdating(true); // Set to updating mode
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [authToken]);

  // Handle form submission (Add or Update)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });

    try {
      let response;
      if (isUpdating) {
        // Update existing profile
        response = await fetch(`http://localhost:3000/api/protected/resume/profileApplicant/:id`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formDataToSubmit,
        });
      } else {
        // Add new profile
        response = await fetch('http://localhost:3000/api/protected/resume/profileApplicant', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formDataToSubmit,
        });
      }

      const data = await response.json();
      console.log('Response:', data); // Debugging log
      console.log('Auth Token:', authToken); // Debugging log
      if (response.ok) {
        alert(isUpdating ? 'Profile updated successfully' : 'Profile added successfully');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    }
  };

  return (
    <div className="profile-form-container">
      <h2>{isUpdating ? 'Update Profile' : 'Create Profile'}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label>Education:</label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Experience:</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Certifications:</label>
            <textarea
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Skills:</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>References:</label>
            <textarea
              name="reference"
              value={formData.reference}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit">{isUpdating ? 'Update Profile' : 'Create Profile'}</button>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
