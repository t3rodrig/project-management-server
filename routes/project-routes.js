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

module.exports = router;