'use strict';

const express = require('express');

// const bearerAuth = require('./auth/middleware/bearerAuth');
const models = require('../models');

const router = express.Router();
router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if(models[modelName]) {
    req.model = models[modelName];
    console.log('--------HELLLLOOO', req.model, modelName);
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);

async function handleGetAll(req, res) {
  const results = await req.model.get();
  res.status(200).json(results);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let result = await req.model.get(id);
  res.status(200).json(result);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newResult = await req.model.create(obj);
  res.status(201).json(newResult);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedResult = await req.model.update(id, obj);
  res.status(200).json(updatedResult);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedResult = await req.model.delete(id);
  res.status(200).json(deletedResult);
}

module.exports = router;
