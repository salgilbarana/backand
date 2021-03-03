const cors = require('cors');
const xss = require('x-xss-protection');
const fastify = require('fastify')({logger: true}) 
const { config } = require('./config'); 
const { handleUncaughtErr } = require('./helper/fatal');

const { initSequelize } = require('./helper/db');
const { initGoogleClient } = require('./helper/google');
const { testRoute } = require('./route/test')

async function start() {
try { 
    handleUncaughtErrors();
// Connect to DB
await initSequelize(config.db);

await initGoogleClient(config.google)

// middleware
await fastify.register(require('middie'))
fastify.use(cors());
fastify.use(xss());

// route
fastify.register(testRoute);

// Listen Port
await fastify.listen(8000, '0.0.0.0');
fastify.log.info('%s is listening...', 'fastify-test');
} catch (err) {
    fastify.log.error(err);
    process.exit(1)
}
}

module.exports = {
    start,
}