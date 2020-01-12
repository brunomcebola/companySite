const express = require('express');
const routes = express.Router();

/* controladores dos pedidos */
const Tester = require('./controllers/Tester');
const AccessRequest = require('./controllers/AccessRequestController')

routes.get('/test', Tester.test);

routes.post('/accessRequest/new', AccessRequest.new);
routes.get('/accessRequest/paginate', AccessRequest.paginate);
routes.delete('/accessRequest/refuse', AccessRequest.refuse)

module.exports = routes;
