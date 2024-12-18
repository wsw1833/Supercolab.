const express = require('express');
const Jar = require('../models/jar');
const User = require('../models/members');

exports.createMember = async (req, res, next) => {
  try {
    const { formMember, creator } = req.body;
    if (
      !creator ||
      !formMember ||
      !formMember.walletId ||
      !formMember.nickName ||
      !formMember.role
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
        success: false,
      });
    }
    let user = await User.findOne({ userId: creator });

    // Check if member already exists
    if (
      user &&
      user.memberList.some((member) => member.walletId === formMember.walletId)
    ) {
      return res.status(409).json({
        message: 'Member already exists',
        success: false,
      });
    }

    // If user exists, add member to the list
    if (user) {
      user.memberList.push(formMember);
      await user.save();
      return res.status(201).json({
        message: 'Member added successfully',
        success: true,
        data: user,
      });
    }

    // If user doesn't exist, create new user with member
    const newUser = new User({
      userId: creator,
      memberList: [formMember],
    });

    await newUser.save();
    return res.status(201).json({
      message: 'New user created with member',
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Error in createMember:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
exports.changeRole = async (req, res, next) => {
  try {
    const { accountId, walletId, role } = req.body;

    // Find the user by accountId
    const user = await User.findOne({ userId: accountId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and update the specific member's role
    const updatedMemberList = user.memberList.map((member) =>
      member.walletId === walletId ? { ...member, role: role } : member
    );

    // Update the user's memberList
    user.memberList = updatedMemberList;
    await user.save();

    res.status(200).json({
      message: 'Member role updated successfully',
      updatedMemberList,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating member role',
      error: error.message,
    });
  }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const { creatorId } = req.params;
    const result = await User.find({ userId: creatorId });

    if (!result || result.length === 0) {
      return res.status(204).end(); // No content
    }

    const memberList = result[0].memberList || [];
    res.status(200).json(memberList);
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};
exports.removeMember = async (req, res, next) => {
  try {
    const { accountId, walletId } = req.body;

    // Find the user by accountId
    const user = await User.findOne({ userId: accountId });

    if (!user) {
      console.log('hi');
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the member with matching walletId
    const updatedMemberList = user.memberList.filter(
      (member) => member.walletId !== walletId
    );

    // Update the user's memberList
    user.memberList = updatedMemberList;
    await user.save();

    res.status(200).json({
      message: 'Member removed successfully',
      updatedMemberList,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error removing member',
      error: error.message,
    });
  }
};
