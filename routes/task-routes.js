const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Project = require('../models/project-model');
const Task = require('../models/task-model');

// mongoose.set('useFindAndModify', false);

// POST route => to create a new task
router.post('/tasks', (req, res, next) => {
  const { title, description } = req.body;
  Task.create({
    title,
    description,
    project: req.body.projectId
  })
    .then(response => { // the new task
      return Project.findByIdAndUpdate(req.body.projectId, {
        $push: {tasks: response._id}
      }, { new: true });
    })
    .then(response => {
      res.json(response);
    })
    .catch(err => res.json(err));
});

// GET route => to retrieve a specific task
router.get('/tasks/:taskId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    res.status(400).json({ message: 'Specified taskId is not valid' });
    return;
  }

  Task.findById(req.params.taskId)
    .then(response => { // a specific task
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