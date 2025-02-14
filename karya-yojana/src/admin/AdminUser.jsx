import { useEffect, useState } from "react";
import axios from "axios";
import "../css/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", gender: "", contactNumber: "" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);  // New state to handle password visibility

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/accGet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }

      // Convert contact to contact_number
      const dataToSend = { 
        ...formData
        // contact_number: formData.contact // Corrected key from contact_number to contactNumber
      };
    //   delete dataToSend.contact;

      if (editingUserId && dataToSend.password === "") {
        delete dataToSend.password;
      }

      if (editingUserId) {
        await axios.put(`http://localhost:3000/api/auth/accUpdate/${editingUserId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post("http://localhost:3000/api/auth/register", dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      setFormData({ username: "", email: "", password: "", gender: "", contact: "" });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleEdit = (user) => {
    setFormData({ username: user.username, email: user.email, password: "", gender: user.gender, contact: user.contact_number ,role:user.role});
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }

      await axios.delete(`http://localhost:3000/api/auth/appManageAcc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token
        },
      });

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // Toggle the visibility of the password
  };

  return (
    <div className="user-management-userAcc">
      <form onSubmit={handleSubmit} className="user-form-userAcc">
        <div className="form-row-userAcc">
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="form-row-userAcc">
          <div className="password-container-user">
            <input 
              type={showPassword ? "text" : "password"}  // Toggle the input type based on the state
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder={editingUserId ? "New Password (optional)" : "Password"} 
              required={!editingUserId} 
            />
            <button type="button" onClick={togglePasswordVisibility} className="show-password-btn-user">
              {showPassword ? "Hide" : "Show"} Password
            </button>
          </div>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-row-userAcc">
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" required />
        </div>
        <div className="form-row-userAcc">
          <button type="submit" className="user-form-submit-button">{editingUserId ? "Update User" : "Create User"}</button>
        </div>
      </form>

      <table className="user-table-userAcc">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.contact_number}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="user-management-table-button">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="user-management-table-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
