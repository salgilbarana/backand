const HttpStatus = require('http-status-codes/index');
const PrefixService = require('../../service/prefix-service');
const UserService = require('../../service/user-service');

const Strings = require('../../resources/strings');

/**
 * 사용자별 메뉴 정보 가져오기
 * @param {*} req
 * @param {*} res
 */
async function getPrefix(req, res) {
  const prefix = await PrefixService.getPrefix(1);
  const morePrefix = await PrefixService.getPrefix(2);

  res.code(HttpStatus.OK).send({
    prefix: prefix.prefix_infos,
    more_prefix: morePrefix.prefix_infos,
  });
}

async function updateUserInfo(req, res) {
  const user = await UserService.updateUserInfo(req.params.idx, req.body);

  res.code(HttpStatus.OK).send(user);
}

async function getUser(req, res) {
  if (req.current_user.idx !== req.params.idx) {
    const err = new Error();
    err.statusCode = HttpStatus.BAD_REQUEST;
    err.message = Strings().NOT_MATCHED_USER_TOKEN;
    throw err;
  }

  const user = await UserService.getUser(req.current_user.idx);

  res.code(HttpStatus.OK).send(user);
}

async function checkExistUser(req, res) {
  await UserService.checkExistUser(req.query);

  res.code(HttpStatus.NO_CONTENT);
}

async function deleteUser(req, res) {
  const isSuccess = await UserService.deleteUser(req.params.idx);

  res.code(HttpStatus.OK).send(isSuccess);
}

async function changePoint(req, res) {
  if (req.current_user.idx !== req.params.idx) {
    const err = new Error();
    err.statusCode = HttpStatus.BAD_REQUEST;
    err.message = Strings().NOT_MATCHED_USER_TOKEN;
    throw err;
  }

  const user = await UserService.changePoint(req.current_user, req.body.point || 0);

  res.code(HttpStatus.OK).send({
    reward: req.body.point || 0,
  });
}

async function buyProduct(req, res) {
  if (req.current_user.idx !== req.params.user_idx) {
    const err = new Error();
    err.statusCode = HttpStatus.BAD_REQUEST;
    err.message = Strings().NOT_MATCHED_USER_TOKEN;
    throw err;
  }

  const reqParams = {
    productIdx: req.params.product_idx || -1,
    payType: req.body.pay_type || -1,
    googleOrderId: req.body.google_order_id || null,
    phoneNumber: req.body.phone_number || null,
  };
  const user = await UserService.buyProduct(req.current_user, reqParams);

  res.code(HttpStatus.OK).send({
    reward: user.reward,
  });
}

module.exports = {
  getPrefix,
  getUser,
  updateUserInfo,
  checkExistUser,
  deleteUser,
  changePoint,
  buyProduct,
};
