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
		method: 'GET',
		path: '/login',
		handler: function(request, reply) {
			reply().code(200);
		},
		config: {
			pre: [{
				method: server.app.user_manage,
				assign: 'session'
			}]
		}
	});

	server.route({
		method: 'POST',
		path: '/login',
		handler: function(request, reply) {
			console.log('login payload:', request.payload);
			wx_request.post({
				url: opts.wx_login,
				form: {
					appid: opts.appid,
					secret: opts.secret,
					js_code: request.payload.code,
					grant_type: 'authorization_code'
				}
			}, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var user_info = {};
					var secret_session = JSON.parse(body);
					
					user_info.openid = secret_session.openid;
					user_info.session = uuid.v1();
					// console.log('user_info:', user_info);
					server.app.cache.set(user_info.session, secret_session, null, (err) => {
						if (err) {
							console.log('server.app.cache.set err:', err);
						}				
					});
					server.app.cache.get(user_info.session, (err, value, cached, log) => {
						if (err) {
							console.log('server.app.cache.get err:', err);
						} else {
							// console.log('server.app.cache.get:', value);
						}
					});
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
					code: Joi.string().min(12).max(50).required()
				}
			}
		}
	});

	server.route({
		method: 'POST',
		path: '/user_info',
		handler: function(request, reply) {
			// console.log('user_info:', request.payload);
			reply(request.payload);
		},
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-user_manage'
};