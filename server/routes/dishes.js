'use strict';

const Boom = require('boom');
const uuid = require('uuid');
const Joi = require('joi');

exports.register = function(server, options, next) {

	const db = server.app.db;

	//PLACEHOLDER
	//--------------------------------------------------------------
	//Here the routes definitions will be inserted in the next steps...
	server.route({
		method: 'GET',
		path: '/dishes',
		handler: function(request, reply) {

			db.books.find((err, docs) => {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});

		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-dishes'
};