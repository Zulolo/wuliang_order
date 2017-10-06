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
		path: '/shop_info',
		handler: function(request, reply) {
			db.shop_info.findOne((err, docs) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				docs.manage_access = true;
				reply(docs);
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/shop_info',
		handler: function(request, reply) {
			var info = request.payload;
			info.date = Date.now();
			if (info.icon) {
				if (info.icon.path) {
					if (fs.existsSync(info.icon.path)) {
						fs.moveSync(info.icon.path, opts.logoLocalPath + opts.logoName, {
							overwrite: true
						});
						info.icon = opts.imageRemotePath + opts.logoName;
					} else {
						delete info.icon;
					}
				} else {
					delete info.icon;
				}
			} 
			db.shop_info.save(info, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(info);
			});
		},
		config: {
			payload: {
				output: 'file',
				maxBytes: 256 * 1024,
				parse: true
			},
			validate: {
				payload: {
					latitude: Joi.number(),
					longitude: Joi.number(),
					name: Joi.string().min(2).max(50).required(),
					address: Joi.string().min(2).max(50).required(),
					tel: Joi.string().required(),
					rank: Joi.number(),
					starttime: Joi.string(),
					endtime: Joi.string(),
					wechat: Joi.string().min(2).max(50).required(),
					icon: Joi.any()
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/shop_info',
		handler: function(request, reply) {
			var info = request.payload;
			info.date = Date.now();
			if (info.icon) {
				if (info.icon.path) {
					if (fs.existsSync(info.icon.path) && 
						db.shop_info.find()) {
						fs.moveSync(info.icon.path, opts.logoLocalPath + opts.logoName, {
							overwrite: true
						});
						info.icon = opts.imageRemotePath + opts.logoName;
					} else {
						delete info.ProductImage;
					}
				} else {
					delete info.ProductImage;
				}
			}
			db.shop_info.update({}, 
			{$set: info}, function(err, result) {
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
				maxBytes: 256 * 1024,
				parse: true
			},
			validate: {
				payload: {
					latitude: Joi.number(),
					longitude: Joi.number(),
					name: Joi.string().min(2).max(50),
					address: Joi.string().min(2).max(50),
					tel: Joi.string().required(),
					rank: Joi.number(),
					starttime: Joi.string(),
					endtime: Joi.string(),
					wechat: Joi.string().min(2).max(50),
					icon: Joi.any()
				}
			}
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-shop_info'
};