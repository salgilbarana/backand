const cors = require('cors');
const xss = require('x-xss-protection');
const formBody = require('fastify-formbody');
const { config } = require('./config');
const { initSequelize } = require('./helper/db');

const { swagger, swaggerConfig } = require('./helper/swagger');
const { handleUncaughtErr } = require('./helper/fatal');
const { infoRoute } = require('./route/info')
const { v1Routes} = require('./route');

const fastify = require('fastify')(config.fastify || {})
const fastifyRedis = require('fastify-redis');
const { multer } = require('./helper/multer');

const socketIoHelper = require('./helper/socketio');

async function start() {
    try {
        handleUncaughtErr();

        // Connect to DB
        await initSequelize(config.db);

        // Swagger
        fastify.register(swagger, swaggerConfig);

        // middleware
        await fastify.register(require('middie'))
        fastify.use(cors());
        fastify.use(xss());
        fastify.register(multer.contentParser);

        // route
        fastify.register(formBody);
        fastify.register(infoRoute);
        fastify.register(v1Routes, { prefix: '/v1' });

        // Redis
        await fastify.register(fastifyRedis, config.redis.chat)
            .register(fastifyRedis, config.redis.review);

        const { redis } = fastify;

        let isConnectedChatRedis = false;
        let isConnectedReviewRedis = false;

        // connection event 
        redis.chat.on('connect', () => {
            isConnectedChatRedis = true;
        });
        redis.review.on('connect', () => {
            isConnectedReviewRedis = true;
        });

        redis.chat.on('error', (err) => {
            console.error(err);
            isConnectedChatRedis = false;
        });
        redis.review.on('error', (err) => {
            console.error(err);
            isConnectedReviewRedis = false;
        });

        // request hook
        fastify.addHook('onRequest', (req, res, done) => {
            if (isConnectedChatRedis) {
                req.chat = redis.chat;
            }
            if (isConnectedReviewRedis) {
                req.review = redis.review;
            }
            done();
        });

        await fastify.listen(8000, '0.0.0.0');
        fastify.log.info('%s is listening...', config.app.name );
        socketIoHelper.register(fastify);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
}

module.exports = {
    start,
}