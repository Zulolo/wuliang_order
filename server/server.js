'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');
const Boom = require('boom');
const server = new Hapi.Server();
server.connection({  
    host: 'localhost', 
    port: 3000
});

// server.app.db =  mysql.createConnection(dbConfig);
server.app.db = mongojs('wuliang_order', ['dishes', 'shop_info']);
server.app.cache = server.cache({segment: 'session', expiresIn: 60 * 60 * 1000 });

server.app.user_manage = function (request, reply) {
    const req = request.raw.req;
    const session = req.headers.session;
    if (session) {
        server.app.cache.get(session, (err, value, cached, log) => {
            if (err) {
                console.log('server get session err:', err);
                return reply(Boom.unauthorized());
            } else {
                if (value) {
                    console.log('session value is:', value);
                    return reply(value);
                } else {
                    console.log('server get session value empty: ', value);
                    return reply(Boom.unauthorized());
                }

            }
        });
    } else {
        console.log('no session found in header.', session);
        return reply(Boom.unauthorized());
    }
};

//Load plugins and start server
server.register([
    require('./routes/dishes'),
    require('./routes/shop_info'),
    require('./routes/user_manage')
], (err) => {
    if (err) {
        throw err;
    }
    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});

