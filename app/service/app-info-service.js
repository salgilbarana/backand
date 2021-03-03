const StatusCodes = require('http-status-codes/index');
const Strings = require('../resources/strings');
const { DBClient } = require('../helper/db');

const { VersionInfoResponseDto } = require('../dto/app-info/version');

const AppVersionRepoImpl = require('../repository/app-version-repository');

const AppVersionRepository = new AppVersionRepoImpl(DBClient().app_version);

async function getAppVersion(reqParams) {
  const versionInfo = await AppVersionRepository.findOne({
    where: {
      agent: reqParams.agent,
    },
  });
  if (!versionInfo) {
    const err = new Error();
    err.statusCode = StatusCodes.OK
    err.message = Strings().NOT_FOUND_VERSION_TO_AGENT;
    throw err;
  }

  return VersionInfoResponseDto.of(versionInfo);
}

module.exports = {
  getAppVersion,
};
