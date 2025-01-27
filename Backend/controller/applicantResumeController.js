import resumeModel from '../model/applicantResumeModel.js';

const saveResume = async (req, res) => {
  console.log('Incoming request data:', req.body); // Log incoming request data
  const { upload } = req.app.locals;
  upload.single('photo')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'File upload error.' });

    const { userId, name, email, phone, education, experience } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      await resumeModel.saveOrUpdateResume(req.app.locals.pool, {
        userId,
        name,
        email,
        phone,
        education,
        experience,
        photoUrl,
      });
      res.status(200).json({ message: 'Resume saved successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving resume.' });
    }
  });
};

const fetchResume = async (req, res) => {
  const { userId } = req.params;
  try {
    const resume = await resumeModel.fetchResumeByUserId(req.app.locals.pool, userId);
    if (resume) res.json(resume);
    else res.status(404).json({ message: 'Resume not found.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resume.' });
  }
};

export { saveResume, fetchResume };
