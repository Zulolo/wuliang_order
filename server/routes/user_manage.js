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
		method: 'POST',
		path: '/login',
		handler: function(request, reply) {
			var user_info = request.payload;
			user_info.openid = "test_openid";
			reply(user_info);
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-user_manage'
};