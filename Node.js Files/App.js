var express = require('express');
var azureMobileApps = require('azure-mobile-apps');
var bodyParser = require('body-parser');
var config  = require('./config');
var jwt     = require('jsonwebtoken');
var passport = require('passport');
var app = express();
var router = express.Router();
var routes = require("./api/APIRoutes");

app.use(bodyParser.json());

app.use(routes);

app.listen(process.env.PORT || 3000);
