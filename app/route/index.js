const fs = require('fs');
const path = require('path');

const v1Routes = (fastify, opts, done) => {
  const directory = path.join(__dirname, 'v1');

  fs.readdirSync(directory).forEach((file) => {
    const routePath = path.join(directory, file);
    const routes = require(routePath)(fastify);
    routes.forEach((route) => fastify.route(route));
  });

  done();
};


module.exports = {
    v1Routes,
  };