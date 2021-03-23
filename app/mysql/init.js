const mysql = require('mysql');
var express = require('express');
let connection = null;
let { host, user, password, database } = require('../config')
let conns = null;
connection = mysql.createPool({
    host,
    user,
    password,
    database,
    multipleStatements: true
});

module.exports = connection;



