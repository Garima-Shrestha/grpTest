import { pool } from '../config/db.js';

// export const getProfile = async (email) => {
//     try {
//       const result = await pool.query('SELECT * FROM applicantResume WHERE user_id = $1', [email]);
//       return result.rows[0];
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       throw new Error('Unable to fetch profile');
//     }
//   };
  

//   export const createOrUpdateProfile = async (firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture ) => {
//     try {
//       const result = await pool.query(
//         `INSERT INTO applicantResume  (first_name, last_name, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profile_picture)
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
//          ON CONFLICT (email) DO UPDATE
//          SET first_name = $1, last_name = $2, contact = $4, address = $5, gender = $6, education = $7, bio = $8, experience = $9, certifications = $10, skills = $11, reference = $12, profile_picture = $13
//          RETURNING *`,
//         [firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture]
//       );
//       return result.rows[0];
//     } catch (error) {
//       console.error('Error creating or updating profile:', error);
//       throw new Error('Unable to create or update profile');
//     }
//   };
  


// create applicant resume
export const createProfile = async (userId, firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture) => {
  const query = `
    INSERT INTO applicantResume  (user_id, first_name, last_name, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profile_picture)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  const values = [userId, firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};


// Update a applicant resume
export const updateProfile = async (resumeId, userId, firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture) => {
  const query = `
    UPDATE applicantResume
    SET first_name = $3, last_name = $4, email=$5, contact = $6, address = $7, gender = $8, education = $9, bio = $10, experience = $11, certifications = $12, skills = $13, reference = $14, profile_picture = $15
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const values = [resumeId, userId, firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};


//Get Applicant Profile
export const getProfile = async (userId) => {
  const query = 'SELECT * FROM applicantResume WHERE user_id = $1;';
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Unable to fetch profile:', error);
    throw error;
  }
};