'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000});

server.route({
    method: 'GET',
    path: '/wuliang_order',
    handler: function (request, reply) {
        reply('wu liang order home!');
    }
});

server.route({
    method: 'GET',
    path: '/wuliang_order/{module}',
    handler: function (request, reply) {
        reply('Module -- ' + encodeURIComponent(request.params.module) + ' under developing!');
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});