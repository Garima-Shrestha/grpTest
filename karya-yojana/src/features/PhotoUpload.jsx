import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeBuilder = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    // Fetch user ID
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/get-user-id');
        setUserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch existing resume
      axios.get(`http://localhost:3000/api/fetch-resume/${userId}`)
        .then((res) => {
          setFormData(res.data);
          if (res.data.photo_url) {
            setPhotoPreview(`http://localhost:3000${res.data.photo_url}`);
          }
        })
        .catch(() => console.log('No resume found'));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    data.append('userId', userId);

    try {
      await axios.post('http://localhost:3000/api/protected/applicant/resume/save-resume', data);
      alert('Resume saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving resume.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-4 bg-white rounded shadow">
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Education</label>
        <textarea
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Experience</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Photo</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
    </form>
  );
};

export default ResumeBuilder;
