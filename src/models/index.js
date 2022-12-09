' use strict';

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('../auth/models/users');
const assignmentModel = require('./assignments');
const submissionModel = require('./submissions');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const db = new Sequelize(DATABASE_URL);

const users = userModel(db, DataTypes);
const assignments = assignmentModel(db, DataTypes);
const submissions = submissionModel(db, DataTypes);


module.exports = {
  db,
  users,
  assignments,
  submissions,
};
