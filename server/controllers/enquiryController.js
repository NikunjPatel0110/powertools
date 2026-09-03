const Enquiry = require('../models/Enquiry');

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).populate('product');
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getEnquiries, createEnquiry };
