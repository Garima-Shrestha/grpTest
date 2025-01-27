const resumeModel = {
    saveOrUpdateResume: async (pool, { userId, name, email, phone, education, experience, photoUrl }) => {
      const query = `
        INSERT INTO resumes (user_id, name, email, phone, education, experience, photo_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id) DO UPDATE
        SET name = $2, email = $3, phone = $4, education = $5, experience = $6, photo_url = COALESCE($7, photo_url)`;
      await pool.query(query, [userId, name, email, phone, education, experience, photoUrl]);
    },
  
    fetchResumeByUserId: async (pool, userId) => {
      const query = 'SELECT * FROM resumes WHERE user_id = $1';
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    }
  };
  
  export default resumeModel;
  