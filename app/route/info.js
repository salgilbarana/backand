const Ping = require('../dto/info/ping');
const DbHealth = require('../dto/info/db-health');

const infoRoute = (fastify, opt, done) => {
    const Controller = require('../controller/info-controller')

    const routes = [
        // check server health
        {
            method: 'GET',
            url:'/health/ping',
            schema: Ping.schema,
            handler: Controller.ping,
        },
        // check DB health
        {
            method: 'GET',
            url: '/health/db',
            schema: DbHealth.schema,
            handler: Controller.checkDbConnection,
        },
    
    ];
    routes.forEach((route) => fastify.route(route));
    done();
};

module.exports = { infoRoute };