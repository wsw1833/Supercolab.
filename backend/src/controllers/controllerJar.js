const express = require('express');
const Jar = require('../models/jar');

exports.getAllJarRecipient = async (req, res, next) => {
  const recipientID = req.params.recipientID;
  const jars = await Jar.find({ recipient: recipientID });

  if (jars.length === 0) {
    return res.status(404).json({
      message: 'No jars found for this creator',
    });
  }

  res.status(200).json(jars);
};
exports.getAllJarApprover = async (req, res, next) => {
  const approverID = req.params.approverID;
  const jars = await Jar.find({ approvers: { $in: [approverID] } });

  if (jars.length === 0) {
    return res.status(404).json({
      message: 'No jars found for this creator',
    });
  }

  res.status(200).json(jars);
};

exports.getJarDetails = async (req, res, next) => {
  const jarId = req.params.jarID;
  const jars = await Jar.findOne({ jarId: jarId });

  if (!jars) {
    return res.status(404).json({
      message: 'Failed to find details of this jar',
    });
  }

  if (jars) {
    //console.log('jardetails', jars);
    res.status(200).json(jars);
  }
};

exports.updateJarApprovals = async (req, res, next) => {
  try {
    const { addressId, jarId } = req.body;
    const timestamp = Date.now();
    const jar = await Jar.findOne({ jarId: jarId });
    if (!jar) {
      return res.status(404).json({ error: 'Jar not found' });
    }

    jar.approvals.push([addressId, timestamp.toString()]);

    // Save the updated jar
    await jar.save();

    const updatedJar = await Jar.findOne({ jarId: jarId });

    res.json({ message: 'Jar updated successfully', jar: updatedJar });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateJarStatus = async (req, res, next) => {
  try {
    const { jarData, status } = req.body;
    const jar = await Jar.findOne({ jarId: jarData.jarId });
    if (!jar) {
      return res.status(404).json({ error: 'Jar not found' });
    }

    jar.status = status;

    await jar.save();

    console.log('success here');
    res.json({ message: 'Jar Status updated successfully', jar });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createJar = async (req, res, next) => {
  try {
    const newJar = new Jar(req.body);
    const result = await newJar.save();

    if (result) {
      res.status(201).json({
        message: 'Jar created successfully',
        post: result,
      });
    }
  } catch (error) {
    console.error('Error creating jar:', error);
    res.status(400).json({
      message: 'Error creating jar',
      error: error.message,
    });
  }
};
