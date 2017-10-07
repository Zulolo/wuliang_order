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
server.app.db = mongojs('wuliang_order', ['dishes', 'shop_info', 'user_info']);
server.app.cache = server.cache({segment: 'session', expiresIn: 60 * 60 * 1000 });

server.app.get_session = function (request, reply) {
    const req = request.raw.req;
    const session = req.headers.session;
    if (session) {
        server.app.cache.get(session, (err, value, cached, log) => {
            if (err) {
                console.log('server get session err:', err);
                return reply(Boom.unauthorized());
            } else {
                if (value) {
                    // console.log('session value is:', value);
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

server.app.get_user = function (request, reply) {
    var openid = request.pre.session.openid;
    if (openid) {
        db.user_info.findOne({openid: openid}, (err, doc) => {
            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }
            if (!doc) {
                return reply(Boom.notFound());
            }
            reply(doc);
        });
    } else {
        console.log('no opnid found in db.', request.pre.session);
        return reply(Boom.unauthorized());
    }
};

// server.app.get_openid_from_session = function (request, reply) {
//     const req = request.raw.req;
//     const session = req.headers.session;
//     if (session) {
//         server.app.cache.get(session, (err, value, cached, log) => {
//             if (err) {
//                 console.log('server get session err:', err);
//                 return null;
//             } else {
//                 return value;
//             }
//         });
//     } else {
//         console.log('no session found in header.', session);
//         return null;
//     }
// };

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

