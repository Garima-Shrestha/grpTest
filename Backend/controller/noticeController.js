import {createNotice,updateNotice,getNoticeById,getAllNotices,deleteNotice,countNotices} from '../model/noticeModel.js';
// Create a new notice
export const createNotices = async (req, res) => {
  try {
    const { title, description } = req.body;
    const notice = await createNotice(title, description);
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
    const notice = await updateNotice(req.params.id, title, description);
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