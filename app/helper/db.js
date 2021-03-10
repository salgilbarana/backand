const Sequelize = require('sequelize-hierarchy')();
const fs = require('fs');

const string = require('../resources/strings');

const entityPath = `${__dirname}/../entity`;
let db = null;
let models = [];

fs.readdirSync(entityPath).forEach((entity) => {
  if (!models) return;
  if (entity[0] === '.' || entity === 'index.js') {
    return;
  }

  const modelName = entity.replace(/\.js$/, '').replace(/-[a-z]/g, (str) => str[1].toUpperCase());
  const model = require(`${entityPath}/${entity}`);

  models[modelName] = model;
});

async function initSequelize(dbConfig) {
  if (db) return;

  db = {};
  db.sequelize = new Sequelize(dbConfig);
  db.Op = Sequelize.Op;

  // entity 초기화
  Object.keys(models).forEach((modelName) => {
    db[modelName] = models[modelName](db.sequelize, Sequelize);
  });

  // associate & post constructor 초기화
  Object.keys(models).forEach((modelName) => {
    const entity = db[modelName];

    if (entity.associate) {
      entity.associate(db);
    }

    if (entity.postConstruct) {
      entity.postConstruct(db);
    }
  });

  await db.sequelize.sync();

  // memory 해제
  models = null;
}

async function checkDbHealth() {
  if (db.sequelize) {
    const getError = await db.sequelize.authenticate();
    
    if (getError === undefined) return string().DB_CONNECTED;
  }

  // new connection 재요청 
  await initSequelize();

  return null;
}

function getHelper() {
  if (!db) {
    throw Error('Db load fail');
  }

  return db;
}

module.exports = {
  DBClient: getHelper,
  initSequelize,
  checkDbHealth,
};