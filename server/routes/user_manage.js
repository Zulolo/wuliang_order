'use strict';

const Boom = require('boom');
const uuid = require('uuid');
const Joi = require('joi');
const fs = require('fs-extra');
var config = require('config-file');
var wx_request = require('request');

var opts = config('/root/wuliang_order/server/config/default.json');

exports.register = function(server, options, next) {

	const db = server.app.db;

	//PLACEHOLDER
	//--------------------------------------------------------------
	//Here the routes definitions will be inserted in the next steps...
	server.route({
		method: 'POST',
		path: '/login',
		handler: function(request, reply) {
			// console.log('login:', request.payload);
			wx_request.post({
				url: opts.wx_login,
				form: {
					appid: request.payload.appid,
					secret: request.payload.secret,
					js_code: request.payload.code,
					grant_type: 'authorization_code'
				}
			}, function(error, response, body) {
				// console.log('error:', error);
				// console.log('response:', response);
				// console.log('body:', body);
				if (!error && response.statusCode == 200) {
					var user_info = {};
					var obj = JSON.parse(body);
					console.log('obj:', obj);
					user_info.openid = obj.openid;
					// if (body.unionid) {
					// 	user_info.unionid = body.unionid;
					// }
					reply(user_info);
				} else {
					return reply(Boom.wrap(error, 'Internal tencent server get session key error.'));
				}
			});
			// reply(request.payload.code);
		},
		config: {
			validate: {
				payload: {
					code: Joi.string().min(12).max(50).required(),
					appid: Joi.string().min(8).max(50).required(),
					secret: Joi.string().min(8).max(50).required(),
				}
			}
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-user_manage'
};