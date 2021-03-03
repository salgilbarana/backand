const StatusCodes = require('http-status-codes/index');
// const { checkDbHealth } = require('../helper/db');
// const AppInfoService = require('../service/app-info-service');

const ping = async (req, res) => {
    // res.code(StatusCodes.OK).send('pong');
    res.send('pong');
  };

// const checkDbConnection = async (req, res) => {
//     let dbHealth = null;
  
//     // check mongo status
//     try {
//       dbHealth = await checkDbHealth();
//     } catch (err) {
//       console.log(err);
//     }
  
//     res.code(HttpStatus.OK).send({
//       status: 'OK',
//       mysql: dbHealth,
//     });
//   };
  
// const getAppVersion = async (req, res) => {
//     const reqParams = req.query || {};
  
//     const version = await AppInfoService.getAppVersion(reqParams);
  
//     res.code(HttpStatus.OK).send(version);
//   };
  
  
module.exports = {
    ping,
    // checkDbConnection,
    // getAppVersion,
  };
  