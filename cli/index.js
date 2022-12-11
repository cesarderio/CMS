'use strict';

import dotenv from 'dotenv';
import inquirer from 'inquirer';
import axios from 'axios';

dotenv.config();

const PORT = process.env.LOCAL_PORT || 3002;
const SERVER = process.env.SERVER_URL || '';
const LOCAL = `http://localhost:${PORT}`;

async function getPOL(environment) {
  const deployedResponse = await axios.get(environment);
  const deployedPOL = deployedResponse.status === 200;
  console.log(`Local status: ${deployedPOL ? 'UP  :)' : 'DOWN  :('}`);
}

getPOL(LOCAL);
getPOL(SERVER);



