import { useState, useEffect } from "react"
import ReactQuill from "react-quill"
import "../css/employerprofile.css"
import 'react-quill/dist/quill.snow.css'; // Import Quill's default style

const EmployerProfile = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [companyType, setCompanyType] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [companyDesc, setCompanyDesc] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    fetchEmployerProfile()
  }, [])

  const fetchEmployerProfile = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:3000/api/employer/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setProfileData(data.profile)
          setName(data.profile.name)
          setEmail(data.profile.email)
          setPhoneNumber(data.profile.phoneNumber)
          setCompanyType(data.profile.companyType)
          setPanNumber(data.profile.panNumber)
          setCompanyDesc(data.profile.companyDesc)
          setPhotoPreview(data.profile.photo)
        } else {
          setErrorMessage("No profile found.")
        }
      } else {
        setErrorMessage("Error fetching employer profile: " + response.statusText)
      }
    } catch (error) {
      setErrorMessage("Request failed: " + error.message)
    }
  }

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("phoneNumber", phoneNumber)
    formData.append("companyType", companyType)
    formData.append("panNumber", panNumber)
    formData.append("companyDesc", companyDesc)
    if (photo) formData.append("photo", photo)

    try {
      const response = await fetch("http://localhost:3000/api/employer/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.profile)
        setErrorMessage("")
      } else {
        const errorData = await response.json()
        setErrorMessage("Error: " + errorData.message)
      }
    } catch (error) {
      setErrorMessage("Request failed: " + error.message)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="employer-profile">
      <h1>Employer Profile</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="profile-container">
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyType">Company Type</label>
            <select id="companyType" value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
              <option value="">Select your company type</option>
              <option value="Startup">Startup</option>
              <option value="SME">SME</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="panNumber">PAN Number</label>
            <input
              id="panNumber"
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
              placeholder="Enter your PAN number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyDesc">Company Description</label>
            <ReactQuill
              value={companyDesc}
              onChange={setCompanyDesc}
              placeholder="Describe your company"
            />
          </div>
          <div className="form-group image-upload">
              <label htmlFor="photo">Company Photo</label>
              {/* Hidden file input */}
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {/* Custom upload button */}
              <label htmlFor="photo" className="custom-upload-btn">
                Choose a File
              </label>

              {/* Display image preview if a photo is selected */}
              {photoPreview && (
                <div className="image-preview">
                  <img src={photoPreview} alt="Preview" />
                </div>
              )}
            </div>

          <button onClick={handleSave} className="save-button">
            Save Profile
          </button>
        </div>
        <div className="profile-display">
          <h2>Your Profile</h2>
          {profileData && (
            <div className="profile-info">
              <div className="profile-photo">
                {photoPreview ? (
                  <img src={photoPreview || "/placeholder.svg"} alt="Company" />
                ) : (
                  <div className="photo-placeholder">No Photo</div>
                )}
              </div>
              <p>
                <strong>Name:</strong> {profileData.name}
              </p>
              <p>
                <strong>Email:</strong> {profileData.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {profileData.phoneNumber}
              </p>
              <p>
                <strong>Company Type:</strong> {profileData.companyType}
              </p>
              <p>
                <strong>PAN Number:</strong> {profileData.panNumber}
              </p>
              <p>
                <strong>Company Description:</strong> {profileData.companyDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployerProfile
