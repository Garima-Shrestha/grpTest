import {createNotice,updateNotice,getNoticeById,getAllNotices,deleteNotice,countNotices} from '../model/noticeModel.js';
import {
  createNotice,
  updateNotice,
  getNoticeById,
  getAllNotices,
  deleteNotice,
} from '../model/noticeModel.js';
import xss from 'xss';
import validator from 'validator';

// Create a new notice
export const createNotices = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    if (!validator.isLength(title, { min: 1, max: 255 })) {
      return res.status(400).json({ message: "Title must be between 1 and 255 characters." });
    }

    if (!validator.isLength(description, { min: 1 })) {
      return res.status(400).json({ message: "Description must not be empty." });
    }

    // Sanitize input
    const sanitizedTitle = xss(title);
    const sanitizedDescription = xss(description);

    const notice = await createNotice(sanitizedTitle, sanitizedDescription);
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error creating notice", error });
  }
};

// Get all notices
export const getAllNotice = async (req, res) => {
  try {
    const notices = await getAllNotices();
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notices", error });
  }
};

// Get a single notice
export const getNoticeId = async (req, res) => {
  try {
    const notice = await getNoticeById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notice", error });
  }
};

// Update a notice
export const updateNotices = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    if (!validator.isLength(title, { min: 1, max: 255 })) {
      return res.status(400).json({ message: "Title must be between 1 and 255 characters." });
    }

    if (!validator.isLength(description, { min: 1 })) {
      return res.status(400).json({ message: "Description must not be empty." });
    }

    // Sanitize input
    const sanitizedTitle = xss(title);
    const sanitizedDescription = xss(description);

    const notice = await updateNotice(req.params.id, sanitizedTitle, sanitizedDescription);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error updating notice", error });
  }
};

// Delete a notice
export const deleteNotices = async (req, res) => {
  try {
    await deleteNotice(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting notice", error });
  }
};


// Admin ko dashboard ma total number of notice dekhauna ko lagi
// export const getTotalNotices = async (req, res) => {
//   try {
//     const count = await countNotices();
//     res.json({ totalNotices: count });
//   } catch (error) {
//     res.status(500).json({ message: "Error counting notices", error });
//   }
// };
export const getTotalNotices = async (req, res) => {
  try {
    console.log('Attempting to count notices...');
    const count = await countNotices();
    console.log(`Found ${count} notices`);
    res.json({ totalNotices: count });
  } catch (error) {
    console.error('Notice count error:', error.stack);
    res.status(500).json({ 
      message: "Error counting notices",
      error: error.message,
      detail: error.stack
    });
  }
};