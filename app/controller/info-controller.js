const StatusCodes = require('http-status-codes/index');
const { checkDbHealth } = require('../helper/db');
const AppInfoService = require('../service/app-info-service');

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
  
// check Version
const getAppVersion = async (req, res) => {
    const reqParams = req.query || {};
  
    const version = await AppInfoService.getAppVersion(reqParams);
  
    res.code(HttpStatus.OK).send(version);
  };
  
module.exports = {
    ping,
    checkDbConnection,
    getAppVersion,
  };
  