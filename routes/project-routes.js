const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Project = require('../models/project-model');
const Task = require('../models/task-model'); // <== !!!

// POST route => to create a new project
router.post('/', (req, res, next) => {
  const { title, description } = req.body;
  Project.create({
    title,
    description,
    Task: [],
    owner: req.user._id
  })
  .then(response => {
    res.json(response);
  })
  .catch(err => res.json(err));
});

// GET route => to get all the projects
router.get('/', (req, res, next) => {
  Project.find()
    .populate('tasks')
    .then(response => {
      res.json(response); // all the projects
    })
    .catch(err => res.json(err));
});

// GET route => to get a specific project/detailed view
router.get('/:id', (req, res, next) => {
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

// PUT route => to update a specific project
router.put('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Project.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `Project with ${req.params.id} is updated successfully.` });
    })
    .catch(err => res.json(err));
});

// DELETE route => to delete a specific project
router.delete('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Project.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({ message: `Project with ${req.params.id} is removed successfully.` });
    })
    .catch(err =>  res.json(err));
});

module.exports = router;