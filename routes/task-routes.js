const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Project = require('../models/project-model');
const Task = require('../models/task-model');

// GET route => to retrieve a specific task
router.get('/projects/:projectId/:taskId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
    res.status(400).json({ message: 'Specified projectId is not valid' });
    return;
  }

  Task.findById(req.params.taskId)
    .then(response => { // a specific task
      res.json(response);
    })
    .catch(err => res.json(err));
});

// POST route => to create a new task
router.post('/tasks', (req, res, next) => {
  Task.create({
    title: req.body.title,
    description: req.body.description,
    project: req.body.projectId
  })
    .then(response => { // the new task
      return Project.findByIdAndUpdate(req.body.projectId, {
        $push: {tasks: response._id}
      });
    })
    .then(response => {
      res.json(response);
    })
    .catch(err => res.json(err));
});

// PUT route => to update a specific task
router.put('/tasks/:taskId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    res.status(400).json({ message: 'Specified taskId is not valid' });
    return;
  }

  Task.findByIdAndUpdate(req.params.taskId, req.body)
    .then(() => {
      res.json({ message: `Task with ${req.params.taskId} is updated successfully.` });
    })
    .catch(err =>  res.json(err));
});

// DELETE route => to delete a specific task
router.delete('/tasks/:taskId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    res.status(400).json({ message: 'Specified taskId is not valid' });
    return;
  }

  Task.findByIdAndRemove(req.params.taskId)
    .then(() => {
      res.json({ message: `Task with ${req.params.taskId} is removed successfully.` });
    })
    .catch(err => res.json(err));
});

module.exports = router;