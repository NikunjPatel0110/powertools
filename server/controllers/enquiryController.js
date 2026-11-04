const Enquiry = require('../models/Enquiry');

const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({}).populate('product');
    res.json(enquiries);
  } catch (error) {
    next(error);
  }
};

const createEnquiry = async (req, res, next) => {
  try {
    const enquiry = new Enquiry(req.body);
    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    next(error);
  }
};
//------------------
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    next(err);
  }
};
//------------------
module.exports = { getEnquiries, createEnquiry, deleteEnquiry };
