const amqp = require('amqplib/callback_api');
const FCM = require('fcm-node');

var amqpConn = null;

const serverKey = 'SERVER_KEY'; // put serverkey
const fcm = new FCM(serverKey)

// processing queue 
function work(msg, cb) {

    try {
      var q_message = msg.content.toString();
  
      if (q_message) {
        q_message = JSON.parse(q_message);
      }
  
      var message = {
        to: q_message.taget, // fcm target token
        data: {
          title:"alert",
          message:{
            highlist:q_message.highlist,
            option: q_message.option,
          }, 
        }
      };
  
      fcm.send(message, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
    } catch (e) {
      console.error("[AMQP] error", e);
    }
    cb(true);
  }
  
  function closeOnErr(err) {
    if (!err) {
      return false;
    }
  
    console.error("[AMQP] error", err);
  
    amqpConn.close();
  
    return true;
  }

function startWorker() {
    amqpConn.createChannel(function (err, ch) {
      if (closeOnErr(err)) {
        return;
      }
  
      ch.on("error", function (err) {
        console.error("[AMQP] channel error", err.message);
      });
  
      ch.on("close", function () {
        console.log("[AMQP] channel closed");
      });
  
      ch.prefetch(10);
  
      ch.assertQueue("fcm-push", { durable: true }, function (err, _ok) {
        if (closeOnErr(err)) {
          return;
        }
  
        ch.consume("fcm-push", processMsg, { noAck: false });
  
        console.log("Worker is started");
      });
  
      function processMsg(msg) {
        work(msg, function (ok) {
          try {
            if (ok) {
              ch.ack(msg);
            } else {
              ch.reject(msg, true);
            }
          } catch (e) {
            closeOnErr(e);
          }
        });
      }
    });
  }

function whenConnected() {
    startWorker();
  }
  

function start() {
  amqp.connect('amqp://usename:password@localhost/vhost_name', function (err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    }

    conn.on("error", function (err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });

    conn.on("close", function () {
      console.error("[AMQP] reconnecting");

      return setTimeout(start, 1000);
    });

    console.log("[AMQP] connected");

    amqpConn = conn;

    whenConnected();
  });
}

start();