import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/NoticeBoard.css";

const API_URL = "http://localhost:3000/api/Notices/notice";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchNotices();
    }
  }, [token]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingId(null);
      } else {
        await axios.post(
          API_URL,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setTitle("");
      setDescription("");
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
    }
  };

  const handleEdit = (notice) => {
    setTitle(notice.title);
    setDescription(notice.description);
    setEditingId(notice.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <div className="container-notice">
      <h2 className="heading-notice">Notice Board</h2>
      <div className="content-wrapper-notice">
        <form onSubmit={handleSubmit} className="form-notice">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-notice"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="textarea-notice"
          />
          <button type="submit" className="button-notice">
            {editingId ? "Update Notice" : "Add Notice"}
          </button>
        </form>
        <div className="notices-container-notice">
          {notices.map((notice) => (
            <div key={notice.id} className="card-notice">
              <div className="content-notice">
                <h3 className="title-notice">{notice.title}</h3>
                <p className="description-notice">{notice.description}</p>
              </div>
              <div className="actions-notice">
                <button className="edit-notice" onClick={() => handleEdit(notice)}>Edit</button>
                <button className="delete-notice" onClick={() => handleDelete(notice.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoticeBoard;
