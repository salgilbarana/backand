const HttpStatus = require('http-status-codes/index');
const HighLightService = require('../../service/highlight-service');
const ChatService = require('../../service/chat-service');
const RabbitMq = require('../../helper/amqp');
const Strings = require('../../resources/strings');

// add highlight song
const addHighLight = async (req, res) => {
  const reqBody = req.body;
  const { files } = req;

  const data = await HighLightService.addHighlight(reqBody, files);
  res.code(HttpStatus.OK).send(data);
};

// add feedback
const addFeedback = async (req, res) => {
  const reqBody = req.body;
  const { files } = req;
  const hostName = req.hostname;
  let feedback;
  let fcmToken = null;

  if (!reqBody.targetHighlight) {
    res.code(HttpStatus.BAD_REQUEST).send(Strings().NOT_EXIST_TAGET);
    return;
  }

  // if want give your highlight, give it
  if (reqBody.highlight) {
    const highlightOne = await HighLightService.findOne({
      where: { idx: reqBody.highlight, user_idx: reqBody.user_idx },
    });

    feedback = await HighLightService.addFeedbackHighlight(
      reqBody, highlightOne.file_idx, hostName, reqBody.score,
    );
  } else {
    feedback = await HighLightService.addFeedback(
      reqBody, files, hostName, reqBody.score,
    );
  }

  const highlight = await HighLightService.getOne(reqBody.targetHighlight);

  const body = {
    host: reqBody.user_idx,
    member: highlight.user_idx,
    highlight_idx: reqBody.targetHighlight,
    feedback_highlight_idx: feedback.idx,
  };

  const duplicateRoom = await ChatService.duplicateRoom(body);

  // check duplicate chat room
  if (Array.isArray(duplicateRoom) && duplicateRoom.length === 0) {
    const room = `${new Date().getTime()}`;
    body.room = room;

    const highlighter = await HighLightService.getUser({ idx: highlight.user_idx }, ['nickname']);
    const reviewer = await HighLightService.getUser({ idx: feedback.user_idx }, ['nickname']);

    let msg;
    let type;

    msg = `https://${hostName}/v1/download/${highlight.file_idx}`;

    const highlightJson = JSON.stringify({
      nickname: `${highlighter.nickname}`, time: `${new Date().getTime()}`, message: `${msg}`,
    });
    // store to redis
    req.chat.zadd(`${room}`, `${new Date().getTime()}`, highlightJson);

    // select file type
    if (Object.keys(files).length !== 0) {
      msg = `https://${hostName}/v1/download/${feedback.file_idx}`;
      type = 'mp3';
    } else if (reqBody.content) {
      msg = reqBody.content;
      type = 'txt';
    }
    const reviewJson = JSON.stringify({
      nickname: `${reviewer.nickname}`, time: `${new Date().getTime() + 1}`, message: `${msg}`, type: `${type}`,
    });
    // store to redis
    req.chat.zadd(`${room}`, `${new Date().getTime() + 1}`, reviewJson);

    // get fcm token
    fcmToken = await ChatService.getUser({ idx: highlight.user_idx }, ['fcm_token']);

    // Automatic room creation
    await ChatService.createRoom(body);

    if (fcmToken) {
      const mqMsg = {
        msg,
        token: fcmToken.fcm_token,
      };

      await RabbitMq.sendQueue(mqMsg);
    }
  }

  res.code(HttpStatus.OK).send({
    data: feedback,
  });
};

// add review
const addReview = async (req, res) => {
  const reqBody = req.body;

  const data = await HighLightService.addReview(reqBody);

  res.code(HttpStatus.OK).send({ data });
};

// get all of highlight 
const getHighLight = async (req, res) => {
  const data = [];
  const reqParams = req.params;
  const hostName = req.hostname;

  const highlight = await HighLightService.getHighlight(reqParams);
  for (const f of highlight) {
    const user = await HighLightService.getUser(
      { idx: f.user_idx },
      ['idx', 'profile_image', 'nickname'],
    );

    const song = await HighLightService.getSong(
      { idx: f.song_idx },
      ['title', 'thumbnail', 'singer'],
    );

    data.push({
      highlight_idx: f.idx,
      user,
      song,
      fileUrl: `https://${hostName}/v1/download/${f.file_idx}`,
    });
  }

  res.code(HttpStatus.OK).send({ data });
};

// get all of feedback for highlight 
const getFeedback = async (req, res) => {
  const reqParams = req.params;

  const data = await HighLightService.getFeedback(
    { highlight_idx: reqParams.idx },
    ['idx', 'file_idx', 'user_idx', 'content', 'like', 'dislike'],
  );
  res.code(HttpStatus.OK).send(data);
};

// get highlight randomly
const getRandom = async (req, res) => {
  const reqParams = req.params;
  const hostName = req.hostname;

  const highlight = await HighLightService.getRandOne(reqParams);

  const data = {
    highlight_idx: highlight[0].idx,
    user: highlight[0].user,
    song: highlight[0].song,
    fileUrl: `https://${hostName}/v1/download/${highlight[0].file_idx}`,
  };

  res.code(HttpStatus.OK).send({ data });
};

// update review
const updateReview = async (req, res) => {
  const data = await HighLightService.updateReview(req.params.idx, req.body);

  res.code(HttpStatus.OK).send(data);
};

// update highlight
const updateHighLights = async (req, res) => {
  const data = await HighLightService.updateHighlights(req.params.idx, req.body);

  res.code(HttpStatus.OK).send(data);
};

// delete review
const deleteReview = async (req, res) => {
  const data = await HighLightService.deleteReview(req.params.idx);

  res.code(HttpStatus.OK).send(data);
};

// delete highlight
const deleteHighLight = async (req, res) => {
  const reqParams = req.params;

  const data = await HighLightService.deleteHighlights(reqParams);

  res.code(HttpStatus.OK).send({ data });
};

// Bring up to 10th
const getHighlightRanks = async (req, res) => {
  const hostName = req.hostname;
  const reqParams = req.params;
  let result = [];
  let data = {};
  const rankData = [];

  const rankHighlight = await req.chat.zrevrange(`${reqParams.songIdx}`, 0, 10, 'WITHSCORES');
  if (rankHighlight) {
    result = rankHighlight.reduce((a, c, i) => (i % 2 ? (a[i / 2 | 0].avgScore = c, a) : (a[i / 2 | 0] = { id: c }, a)), []);
  }

  for (const f of result) {
    data = JSON.parse(f.id);
    rankData.push({
      idx: data.highlighIdx,
      fileUrl: `https://${hostName}/v1/download/${data.fileIdx}`,
      likeCount: data.cntLike,
      commentCount: data.cntComment,
      avgScore: f.avgScore,
    });
  }

  res.code(HttpStatus.OK).send(rankData);
};

module.exports = {
  addHighLight,
  addFeedback,
  addReview,
  getHighLight,
  getFeedback,
  getRandom,
  getHighlightRanks,
  updateReview,
  updateHighLights,
  deleteReview,
  deleteHighLight,
};
