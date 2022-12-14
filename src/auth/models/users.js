'use stric';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'CMS-SECRET';

const userModel = (db, DataTypes) => {
  const model = db.define('Users', {
    username: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
    role: {
      type: DataTypes.ENUM('Instructor', 'TA', 'Student'),
      required: true,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
      set(tokenObj) {
        return jwt.sign(tokenObj, SECRET);
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          Instructor: ['create', 'read', 'update', 'delete'],
          TA: ['read', 'update'],
          Student: ['create', 'read'],
        };
        return acl[this.role];
      },
    },
  });

  model.beforeCreate( async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.authBasic = async function (username, password)  {
    const user = await this.findOne({ where: { username }});
    const valid = await bcrypt.compare(password, user.password);
    if(valid) {
      return user;
    }
    throw new Error('Invalid User');
  };

  model.authToken = async function (token)  {
    console.log(token);
    const parsedToken = jwt.verify(token, SECRET);
    console.log(parsedToken);
    const user = this.findOne({where: { username: parsedToken.username}});
    console.log(user);
    if(user) {
      return user;
    }
    throw new Error('User Not Found');
  };
  return model;
};

module.exports = userModel;
