'use strict';

const Hapi = require('hapi');
// var mysql = require('mysql');
const mongojs = require('mongojs');
// var config = require('config');

// var dbConfig = config.get('dbConfig');
// var mysql_conn = mysql.createConnection(dbConfig);
const server = new Hapi.Server();
server.connection({  
    host: 'localhost', 
    port: 3000
});

// server.app.db =  mysql.createConnection(dbConfig);
server.app.db = mongojs('hapi-rest-mongo', ['dishes']);

//Load plugins and start server
server.register([
    require('./routes/dishes')
], (err) => {
    if (err) {
        throw err;
    }
    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});

// server.route({
//     method: 'GET',
//     path: '/wuliang_order',
//     handler: function (request, reply) {
//         reply('wu liang order home!');
//     }
// });

// server.route({
//     method: 'GET',
//     path: '/wuliang_order/menu/list_all',
//     handler: function (request, reply) {
//         reply(results);
//     }
// });

// server.route({
//     method: 'GET',
//     path: '/wuliang_order/{module}',
//     handler: function (request, reply) {
//         // reply('Module -- ' + encodeURIComponent(request.params.module) + ' under developing!');
//         mysql_conn.connect();
 
//         mysql_conn.query('SELECT * from menu', function (error, results, fields) {
//         if (error) throw error;
//             console.log('The solution is: ', results[0].solution);
//         });
//         reply(results);
//         mysql_conn.end();
//     }
// });



// server.start((err) => {

//     if (err) {
//         throw err;
//     }
//     console.log(`Server running at: ${server.info.uri}`);
// });
