/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const HttpStatus = require('http-status-codes/index');
const ifaces = require('os').networkInterfaces();
const { DBClient } = require('../helper/db');
const Strings = require('../resources/strings');

const HighlightRepoImpl = require('../repository/highlight-repository');
const UserRepoImpl = require('../repository/user-repository');
const FileRepoImpl = require('../repository/file-repository');
// const SongRepoImpl = require('../repository/song-repository');
const HighlightHistoryRepoImpl = require('../repository/highlight-history-repository');

const HighlightRepository = new HighlightRepoImpl(DBClient().highlight);
const FeedbackRepository = new HighlightRepoImpl(DBClient().feedback_highlight);
const ReviewRepository = new HighlightRepoImpl(DBClient().review_highlight);
const UserRepository = new UserRepoImpl(DBClient().user);
const FileRepository = new FileRepoImpl(DBClient().file);
// const SongRepository = new SongRepoImpl(DBClient().song);
const HighlightHistoryRepository = new HighlightHistoryRepoImpl(DBClient().highlight_history);

async function addHighlight(params, files) {
  let ip;
  let file = {};

  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].filter((details) => {
      if (details.family === 'IPv4' && details.internal === false) {
        ip = details.address;
      }
      return ip;
    });
  });

  if (Object.keys(files).length !== 0) {
    const filePath = files.audio[0].path;
    file = await FileRepository.createOne({ path: filePath, ip });
  }
  const highlight = await HighlightRepository.createOne({
    user_idx: params.user_idx,
    song_idx: params.song_idx,
    file_idx: file.idx || null,
    count: params.count || undefined,
  });

  return highlight;
}

// give feedback
async function addFeedback(params, files, hostName, score) {
  let ip;
  let fileIdx = null;
  let fileUrl = null;

  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].filter((details) => {
      if (details.family === 'IPv4' && details.internal === false) {
        ip = details.address;
      }
      return ip;
    });
  });

  if (Object.keys(files).length !== 0) {
    const filePath = files.audio[0].path;
    const file = await FileRepository.createOne({ path: filePath, ip });
    fileUrl = `https://${hostName}/v1/download/${file.idx}`;
    fileIdx = file.idx;
  }

  const review = await FeedbackRepository.createOne({
    highlight_idx: params.targetHighlight,
    file_idx: fileIdx,
    user_idx: params.user_idx,
    content: params.content || null,
    score,
  });

  if (params.params) {
    review.dataValues.like = params.like;
    review.dataValues.dislike = null;
  } else if (params.dislike) {
    review.dataValues.dislike = params.dislike;
    review.dataValues.like = null;
  }

  review.dataValues.fileUrl = fileUrl;
  return review;
}

// give feedback with highlight
async function addFeedbackHighlight(params, fileIdx, hostName, score) {
  let ip;

  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].filter((details) => {
      if (details.family === 'IPv4' && details.internal === false) {
        ip = details.address;
      }
      return ip;
    });
  });

  const fileUrl = `https://${hostName}/v1/download/${fileIdx}`;

  const review = await FeedbackRepository.createOne({
    highlight_idx: params.targetHighlight,
    file_idx: fileIdx,
    user_idx: params.user_idx,
    content: params.content || null,
    score,
  });

  if (params.like) {
    review.dataValues.like = params.like;
    review.dataValues.dislike = null;
  } else if (params.dislike) {
    review.dataValues.dislike = params.dislike;
    review.dataValues.like = null;
  }

  review.dataValues.fileUrl = fileUrl;
  return review;
}

async function addReview(params) {
  const review = await ReviewRepository.createOne({
    parent_idx: params.parent_idx || null,
    highlight_idx: params.highlight_idx,
    user_idx: params.user_idx,
    content: params.content || null,
    like: params.like || null,
  });

  return review;
}

async function getHighlight(where, attributes) {
  const highlight = await HighlightRepository.findAll({
    where,
    attributes,
  });

  return highlight;
}

async function getFeedback(where, attributes) {
  const highlights = await FeedbackRepository.findAll({
    where,
    attributes,
  });

  return highlights;
}

async function getOne(params) {
  const highlights = await HighlightRepository.findOneByPk(Number(params));

  return highlights;
}

async function findOne(params) {
  const highlights = await HighlightRepository.findOne(params);

  return highlights;
}

async function getRandOne(params) {
  const history = await HighlightHistoryRepository.findAll({
    where: {
      user_idx: params.user_idx,
    },
    attributes: ['highlight_idx'],
  });

  const randomOne = await HighlightRepository.findExceptIdx(params, 1);
  if (randomOne.length === 0) {
    const err = new Error();
    err.statusCode = HttpStatus.NOT_FOUND;
    err.message = 'not exist Highlight';
    throw err;
  }

  const t = history.find((x) => x.highlight_idx === randomOne[0].idx);

  if (t === undefined) {
    await randomOne[0].decrement({ count: 1 });
    await HighlightHistoryRepository.findOrCreate({
      where: {
        user_idx: params.user_idx,
        highlight_idx: randomOne[0].idx,
      },
    }, {
      user_idx: params.user_idx,
      highlight_idx: randomOne[0].idx,
    });
    return randomOne;
  }

  if (t.highlight_idx === randomOne[0].idx) {
    const err = new Error();
    err.statusCode = HttpStatus.NOT_FOUND;
    err.message = 'not exist Highlight';
    throw err;
  }
}

async function getUser(where, attributes) {
  const userInfo = await UserRepository.findOne({
    where,
    attributes,
  });
  return userInfo;
}

// async function getSong(where, attributes) {
//   const songInfo = await SongRepository.findOne({
//     where,
//     attributes,
//   });
//   return songInfo;
// }

async function getFile(where, attributes) {
  const fileInfo = await FileRepository.findOne({
    where,
    attributes,
  });
  return fileInfo;
}

async function updateReview(idx, params = {}) {
  const updateClause = {};
  if (params.content) {
    updateClause.content = params.content;
  }
  if (Object.prototype.hasOwnProperty.call(params, 'like')) {
    updateClause.like = params.like;
  }

  const result = await ReviewRepository.updateOne(updateClause, {
    where: {
      idx,
    },
  });

  return result;
}

async function deleteReview(idx) {
  const result = await ReviewRepository.findOneByPk(idx);
  if (!result) {
    const err = new Error();
    err.statusCode = HttpStatus.NOT_FOUND;
    err.message = Strings('not found review');
    throw err;
  }

  await result.destroy();

  return result;
}

/**
 * 하이라이트 수정
 * @param {*} params
 */
async function updateHighlights(idx, params = {}) {
  const updateClause = {};
  if (params.user_idx) {
    updateClause.user_idx = params.user_idx;
  }
  if (params.file_idx) {
    updateClause.file_idx = params.file_idx;
  }
  if (params.song_idx) {
    updateClause.song_idx = params.song_idx;
  }

  const result = await HighlightRepository.updateOne(updateClause, {
    where: {
      idx,
    },
  });
  return result;
}

/**
 * 하이라이트 삭제
 * @param {*} params
 */
async function deleteHighlights(params) {
  const highlight = await HighlightRepository.deleteOne({
    where: {
      idx: params.idx,
    },
  });
  if (!highlight) {
    const err = new Error();
    err.statusCode = HttpStatus.NOT_FOUND;
    err.message = Strings().INVALID_HIGHLIGHT;
    throw err;
  }

  return highlight;
}

module.exports = {
  addHighlight,
  addReview,
  addFeedback,
  addFeedbackHighlight,
  getHighlight,
  getFeedback,
  getRandOne,
  getOne,
  getUser,
  // getSong,
  getFile,
  findOne,
  updateReview,
  updateHighlights,
  deleteReview,
  deleteHighlights,
};
