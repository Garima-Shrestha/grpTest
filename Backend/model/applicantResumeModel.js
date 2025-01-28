import {pool} from '../config/db.js';

export const addResume = async (userId, fullName, email, contact, address, education, experience, skills, certifications) => {
  const query = `
    INSERT INTO resumes (user_id, full_name, email, contact, address, education, experience, skills, certifications)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [userId, fullName, email, contact, address, education, experience, skills, certifications];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getResumesByUserId = async (userId) => {
  const query = `SELECT * FROM resumes WHERE user_id = $1;`;
  const values = [userId];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting workout logs:', error);
    throw error;
  }
};

export const updateResume = async (resumeId, userId, fullName, email, contact, address, education, experience, skills, certifications) => {
  const query = `
    UPDATE resumes
    SET full_name = $1, email = $2, contact = $3, address = $4, education = $5, experience = $6, skills = $7, certifications = $8
    WHERE id = $9 AND user_id = $10
    RETURNING *;
  `;
  const values = [fullName, email, contact, address, education, experience, skills, certifications, resumeId, userId];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the updated resume
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};



export const deleteResume = async (resumeId, userId) => {
  const query = `DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING *;`;
  const values = [resumeId, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getResumeById = async (resumeId, userId) => {
  const query = `SELECT * FROM resumes WHERE id = $1 AND user_id = $2;`;
  const values = [resumeId, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};
