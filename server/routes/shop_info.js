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
			db.shop_info.find((err, docs) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(docs);
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/shop_info',
		handler: function(request, reply) {
			const info = request.payload;
			info.date = Date.now();
			if (fs.existsSync(request.payload.icon.path)) {
				var imageSavePath = opts.imagePath + 'wuliang_order_logo.jpg';
				fs.moveSync(request.payload.icon.path, imageSavePath, {
					overwrite: true
				});
				info.icon = imageSavePath;
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
					name: Joi.string().min(2).max(50),
					address: Joi.string().min(2).max(50),
					tel: Joi.number(),
					starttime: Joi.date(),
					endtime: Joi.date(),
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