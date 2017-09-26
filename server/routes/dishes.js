'use strict';

const Boom = require('boom');
const uuid = require('uuid');
const Joi = require('joi');
const fs = require('fs-extra');
var config = require('config-file');

var opts = config('/root/wuliang_order/server/config/default.json');

exports.register = function(server, options, next) {

	const db = server.app.db;

	//PLACEHOLDER
	//--------------------------------------------------------------
	//Here the routes definitions will be inserted in the next steps...
	server.route({
		method: 'GET',
		path: '/dishes',
		handler: function(request, reply) {
			db.dishes.distinct('ProductType', {}, (err, list) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				if (!list) {
					return reply(Boom.notFound());
				}
				var result = {};
				result.cost = 0;
				result.number = 0;
				result.menu = [];
				list.forEach(function(item, index) {
					db.dishes.find({ProductType: item}, (err, doc) => {
						if (err) {
							return reply(Boom.wrap(err, 'Internal MongoDB error'));
						}
						if (doc) {
							// console.log('result 0:', result[0]);
							var menu = {};
							menu.ProductType = item;
							menu.menuContent = doc;
							result.menu.push(menu);
							if (result.menu.length === list.length) {
								reply(result);
							}
						}
					});					
				})
			});
		}
		config: {
			pre: [{
				method: server.app.user_manage /* function to be called */
			}]
		}
	});


	server.route({
		method: 'GET',
		path: '/dishes/{id}',
		handler: function(request, reply) {
			db.dishes.findOne({_id: request.params.id}, (err, doc) => {
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
			var dish = request.payload;
			//Create an id
			dish._id = uuid.v1();
			dish.date = Date.now();
			if (dish.ProductImage) {
				if (dish.ProductImage.path) {
					var imageSavePath = opts.imageLocalPath + dish._id + '.jpg';
					if (fs.existsSync(dish.ProductImage.path)) {
						fs.moveSync(dish.ProductImage.path, imageSavePath, {
							overwrite: true
						});
						dish.ProductImage = opts.imageRemotePath + dish._id + '.jpg';
					} else {
						delete dish.ProductImage;
					}
				} else {
					delete dish.ProductImage;
				}
			} 
			db.dishes.save(dish, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(dish);
			});
		},
		config: {
			payload: {
				output: 'file',
				maxBytes: 1024 * 1024 * 1,
				parse: true
			},
			validate: {
				payload: {
					CreatePerson: Joi.string().min(2).max(50).required(),
					ProductName: Joi.string().min(2).max(100).required(),
					ProductType: Joi.string().valid("快餐", "营养套餐", "垃圾食品", "猪吃的").required(),
					ProductRate: Joi.number(),
					ProductSize: Joi.string().min(2).max(50),
					ProductPrice: Joi.number().required(),
					ProductImage: Joi.any()
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/dishes/{id}',
		handler: function(request, reply) {
			var dish = request.payload;
			dish.date = Date.now();
			if (dish.ProductImage) {
				if (dish.ProductImage.path) {
					var imageSavePath = opts.imageLocalPath + request.params.id + '.jpg';
					if (fs.existsSync(dish.ProductImage.path) && 
						db.dishes.find({_id: request.params.id})) {
						fs.moveSync(dish.ProductImage.path, imageSavePath, {
							overwrite: true
						});
						dish.ProductImage = opts.imageRemotePath + request.params.id + '.jpg';
					} else {
						delete dish.ProductImage;
					}
				} else {
					delete dish.ProductImage;
				}
			}
			db.dishes.update({_id: request.params.id}, 
			{$set: dish}, function(err, result) {
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
			payload: {
				output: 'file',
				maxBytes: 1024 * 1024 * 1,
				parse: true
			},
			validate: {
				payload: {
					CreatePerson: Joi.string().min(2).max(50),
					ProductName: Joi.string().min(2).max(100),
					ProductSize: Joi.string().min(2).max(50),
					ProductType: Joi.string().min(2).max(100),
					ProductPrice: Joi.number(),
					ProductImage: Joi.any()
				}
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