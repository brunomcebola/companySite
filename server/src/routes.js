const express = require('express');
const routes = express.Router();

/* controladores dos pedidos */
const AccessRequest = require('./controllers/AccessRequestController')

routes.post('/accessRequest/new', AccessRequest.new);
routes.get('/accessRequest/paginate', AccessRequest.paginate);
routes.get('/accessRequest/accept', AccessRequest.accept);
routes.delete('/accessRequest/refuse', AccessRequest.refuse);


module.exports = routes;
