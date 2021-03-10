const { DBClient } = require('../helper/db');
const FileRepoImpl = require('../repository/updown-repository');

const FileRepository = new FileRepoImpl(DBClient().file);

async function addFile(params) {
  const file = await FileRepository.createOne({
    path: params,
  });

  return file;
}

async function getFile(params) {
  const fileName = await FileRepository.findOneByPk(params);
  return fileName;
}

module.exports = {
  addFile,
  getFile,
};
