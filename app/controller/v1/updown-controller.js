const HttpStatus = require('http-status-codes/index');

const fs = require('fs');
const path = require('path');

const updownService = require('../../service/updown-service');


const addFile = async (req, res) => {
  const params = req.file.path;

  const data = await updownService.addFile(params);

  res.code(HttpStatus.OK).send({ data });
};

const getFile = async (req, res) => {
  const params = req.params.file_idx;

  const data = await updownService.getFile(params);

  // const form = path.join(__dirname, `../../../../../${data.dataValues.path}`);
  const form = path.join(`${data.dataValues.path}`);

  res.code(HttpStatus.OK).type('audio/mpeg').send(fs.createReadStream(form));
};

module.exports = {
  addFile,
  getFile,
};
