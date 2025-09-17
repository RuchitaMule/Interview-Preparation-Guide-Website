require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const { authenticateUser } = require('../middleware/authMiddleware');
const Progress = require('../models/Progress');

const JWT_SECRET = process.env.JWT_SECRET;

//  Get all roadmap route for displaying all roadmaps to users
router.get('/', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    if (!roadmaps) {
      return res.status(400).json({ message: "Nothing in Roadmaps collection..add roadmaps" });
    }
    return res.status(200).json(roadmaps);
  } catch (error) {
    return res.status(500).json({ message: `Server/database Error:${error}` });
  }
});

//Follow roadmap
router.post('/follow/:roadmapId', authenticateUser, async (req, res) => {
  const roadmapId = new mongoose.Types.ObjectId(req.params.roadmapId);
  const userId = req.user?._id;

  console.log(" Authenticated User ID:", req.user?._id);
  console.log(" Roadmap ID:", roadmapId);
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID missing from request" });
    }

    const followedRoadmap = await Progress.findOne({ userId, roadmapId });
    if (followedRoadmap) {
      return res.status(400).json({ message: `Roadmap already followed.` });
    }

    const newProgress = new Progress({
      userId,
      roadmapId,
      completedSteps: [],
      quizScores: [],
    });
    await newProgress.save();
    return res.status(201).json({ message: "Roadmap followed successfully!", progress: newProgress });
  } catch (error) {
    return res.status(500).json({ message: `Server/database Error:${error}` });
  }
});



router.get('/followed', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const followedRoadmaps = await Progress.find({ userId }).populate('roadmapId').lean();

    if (!followedRoadmaps.length) {
      return res.status(404).json({ message: "No followed roadmaps found" });
    }

    const roadmapData = followedRoadmaps.map((progress) => {
      const roadmap = progress.roadmapId;
      const completedSteps = progress.completedSteps;

      const stepsWithStatus = roadmap.steps.map(step => ({
        step: step.title,
        subSteps: step.subSteps.map(sub => ({
          text: sub.text,
          completed: completedSteps.includes(sub.text)
        }))
      }));

      return {
        roadmapId: roadmap._id,
        title: roadmap.title,
        steps: stepsWithStatus
      };
    });

    return res.status(200).json(roadmapData);
  } catch (error) {
    return res.status(500).json({ message: `Server/database Error: ${error}` });
  }
});


//Unfollow a roadmap


router.delete('/unfollow/:roadmapId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // assuming user ID is in req.user
    const roadmapId = req.params.roadmapId;

    // Find and remove the progress of the roadmap for the user
    const progress = await Progress.findOneAndDelete({ userId, roadmapId });

    if (!progress) {
      return res.status(404).json({ message: "Roadmap not found for this user." });
    }

    res.status(200).json({ message: "Unfollowed roadmap successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});






// ✅ Refactored route to fetch all roadmap progress with percentage, title, and total/completed steps
router.get('/progress/:userId', authenticateUser, async (req, res) => {
  const userId = req.user._id;

  try {
    const progressDocs = await Progress.find({ userId }).populate('roadmapId');
    if (!progressDocs || progressDocs.length === 0) {
      return res.status(404).json({ message: "You haven't followed any roadmaps yet." });
    }

    const progressData = progressDocs.map(progress => {
      const roadmap = progress.roadmapId;
      const completedSteps = progress.completedSteps || [];

      const allSubSteps = (roadmap?.steps || []).flatMap(step =>
        (step.subSteps || []).map(sub => sub.text)
      );

      const total = allSubSteps.length;
      const completed = allSubSteps.filter(sub => completedSteps.includes(sub)).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        roadmapId: roadmap._id,
        title: roadmap.title || 'Untitled Roadmap',
        totalSteps: total,
        completedStepsCount: completed,
        completionPercent: percent,
        completedStepTexts: completedSteps
      };
    });

    return res.status(200).json({
      message: "Fetched roadmap progress successfully",
      data: progressData
    });

  } catch (error) {
    console.error("Error fetching roadmap progress:", error);
    return res.status(500).json({ message: `Server/database Error: ${error.message}` });
  }
});




// ✅ Update progress on checkbox toggle
router.patch('/progress/update', authenticateUser, async (req, res) => {
  const userId = req.user._id;
  const { roadmapId, subStepText, checked } = req.body;
  if (!mongoose.Types.ObjectId.isValid(roadmapId)) {
    return res.status(400).json({ message: "Invalid roadmapId" });
  }


  if (!roadmapId || !subStepText || typeof checked !== 'boolean') {
    return res.status(400).json({ message: "roadmapId, subStepText and checked (true/false) are required" });
  }

  try {
    const progress = await Progress.findOne({ userId, roadmapId });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found for this roadmap" });
    }

    if (checked) {
      if (!progress.completedSteps.includes(subStepText)) {
        progress.completedSteps.push(subStepText);
      }
    } else {
      progress.completedSteps = progress.completedSteps.filter(step => step !== subStepText);
    }

    await progress.save();
    res.status(200).json({ message: "Progress updated", completedSteps: progress.completedSteps });
  } catch (error) {
    return res.status(500).json({ message: `Server/database Error:${error}` });
  }
});



// ✅ Fetch specific roadmap by ID
router.get('/:roadmapid', async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.roadmapid);
    if (!roadmap) {
      return res.status(400).json({ message: "Roadmap not found" });
    }
    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: `Server/database Error:${error}` });
  }
});

module.exports = router;
