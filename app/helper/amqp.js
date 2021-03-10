const amqp = require('amqplib/callback_api');
const { config } = require('../config');

function encode(doc) {
  return new Buffer.from(JSON.stringify(doc));
}

exports.sendQueue = async (msg) => {
  await amqp.connect(config.rabbitmq.url, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = 'fcm-push';

      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, encode(msg));

      console.log(' [x] Sent %s', msg);
    });
    setTimeout(() => {
      connection.close();
    }, 500);
  });
};
