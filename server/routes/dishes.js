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
			db.dishes.find((err, docs) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(docs);
			});
		}
	});

	server.route({
		method: 'GET',
		path: '/dishes/{id}',
		handler: function(request, reply) {
			db.dishes.findOne({
				_id: request.params.id
			}, (err, doc) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				if (!doc) {
					return reply(Boom.notFound());
				}
				reply(doc);
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/dishes',
		handler: function(request, reply) {
			const dish = request.payload;
			//Create an id
			dish._id = uuid.v1();
			db.dishes.save(dish, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(dish);
			});
		},
		config: {
			validate: {
				payload: {
					CreatePerson: Joi.string().min(2).max(100).required(),
					ProductName: Joi.string().min(2).max(100).required(),
					ProductPrice: Joi.number().required()
				}
			}
		}
	});

	server.route({
		method: 'PATCH',
		path: '/dishes/{id}',
		handler: function(request, reply) {
			db.dishes.update({
				_id: request.params.id
			}, {
				$set: request.payload
			}, function(err, result) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				if (result.n === 0) {
					return reply(Boom.notFound());
				}
				reply().code(204);
			});
		},
		config: {
			validate: {
				payload: Joi.object({
					ProductPrice: Joi.number().required()
				}).required().min(1)
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/dishes/{id}',
		handler: function(request, reply) {
			db.dishes.remove({
				_id: request.params.id
			}, function(err, result) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				if (result.n === 0) {
					return reply(Boom.notFound());
				}
				reply().code(204);
			});
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-dishes'
};