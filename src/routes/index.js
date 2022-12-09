'use strict';

const express = require('express');
const permissions = require('../auth/middleware/acl');
const bearerAuth = require('../auth/middleware/bearer');
const models = require('../models');

const router = express.Router();
router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if(models[modelName]) {
    req.model = models[modelName];

    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model',bearerAuth, permissions('read'), handleGetAll);
router.get('/:model/:id',bearerAuth, permissions('read'), handleGetOne);
router.post('/:model',bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id',bearerAuth, permissions('update'), handleUpdate);
router.delete('/:model/:id',bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  const results = await req.model.findAll({});
  res.status(200).json(results);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let result = await req.model.findOne({where: {id}});
  res.status(200).json(result);
}

async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    let maybeResult = await req.model.findOne({where: {name: obj.name}});
    if(maybeResult){
      throw 'Validation Error';
    }
    let newResult = await req.model.create(obj);
    res.status(201).json(newResult);

  } catch (e) {
    next(e);
  }
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  await req.model.update(obj, {where: {id}});
  let updatedResult = await req.model.findOne({where: {id}});
  res.status(200).json(updatedResult);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedResult = await req.model.destroy({where: {id}});
  res.status(200).json(deletedResult);
}

module.exports = router;
