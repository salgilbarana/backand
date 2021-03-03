
const testRoute = (fastify, opt, done) => {
    const Controller = require('../controller/test-controller')

    const routes = [
        {
            method: 'GET',
            url:'/health/ping',
            handler: Controller.ping,
        },
        // {
        //     method: 'GET',
        //     url: '/health/db',
        //     handler: Controller.checkDbConnection,
        // },
        // {
        //     method: 'GET',
        //     url: '/app/version',
        //     handler: Controller.getAppVersion,
        // },
    ];
    routes.forEach((route) => fastify.route(route));
    done();
};

module.exports = { testRoute };