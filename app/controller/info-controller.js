const StatusCodes = require('http-status-codes/index');
const { checkDbHealth } = require('../helper/db');

// check server health
const ping = async (req, res) => {
    res.code(StatusCodes.OK).send('pong');
  };

// check DB health
const checkDbConnection = async (req, res) => {
    let dbHealth = null;
  
    try {
      dbHealth = await checkDbHealth();
    } catch (err) {
      console.log(err);
    }
  
    res.code(StatusCodes.OK).send({
      status: 'OK',
      mysql: dbHealth,
    });
  };
  
module.exports = {
    ping,
    checkDbConnection,
  };
  