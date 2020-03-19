const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Project = require('../models/project-model');
const Task = require('../models/task-model'); // <== !!!

// POST route => to create a new project
router.post('/projects', (req, res, next) => {
  const { title, description } = req.body;
  Project.create({
    title,
    description,
    Task: []
  })
  .then(response => {
    res.json(response);
  })
  .catch(err => res.json(err));
});

// GET route => to get all the projects
router.get('/projects', (req, res, next) => {
  Project.find()
    .populate('tasks')
    .then(response => {
      res.json(response); // all the projects
    })
    .catch(err => res.json(err));
});

// GET route => to get a specific project/detailed view
router.get('/projects/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  // Our project have array of tasks' ids and
  // we can use .populate() method to get the whole task objects
  Project.findById(req.params.id)
    .populate('tasks')
    .then(response => { // a specific project
      res.status(200).json(response);
    })
    .catch(err => res.json(err));
});

module.exports = router;