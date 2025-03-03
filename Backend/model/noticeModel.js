import {pool} from '../config/db.js'


export const createNotice = async (title, description) => {
  const result = await pool.query(
    "INSERT INTO notices (title, description) VALUES ($1, $2) RETURNING *",
    [title, description]
  );
  return result.rows[0];
};


export const getAllNotices = async () => {
  const result = await pool.query("SELECT * FROM notices ORDER BY created_at DESC");
  return result.rows;
};


export const getNoticeById = async (id) => {
  const result = await pool.query("SELECT * FROM notices WHERE id = $1", [id]);
  return result.rows[0];
};


export const updateNotice = async (id, title, description) => {
  const result = await pool.query(
    "UPDATE notices SET title = $1, description = $2 WHERE id = $3 RETURNING *",
    [title, description, id]
  );
  return result.rows[0];
};


export const deleteNotice = async (id) => {
  await pool.query("DELETE FROM notices WHERE id = $1", [id]);
};



// Admin ko dashboard ma total number of notice dekhauna ko lagi
export const countNotices = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM notices");
  return parseInt(result.rows[0].count, 10);
};
