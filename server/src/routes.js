const express = require('express');
const routes = express.Router();

/* controladores dos pedidos */
const AccessRequest = require('./controllers/AccessRequestController')
const Users = require('./controllers/UsersController')

routes.post('/accessRequest/new', AccessRequest.new);
routes.get('/accessRequest/paginate', AccessRequest.paginate);
routes.get('/accessRequest/accept', AccessRequest.accept);
routes.delete('/accessRequest/refuse', AccessRequest.refuse);

routes.post('/users/login', Users.login);
routes.get('/users/name', Users.name);
routes.get('/users/permissions', Users.permissions);
routes.get('/users/paginate', Users.paginate);
routes.delete('/users/exclude', Users.exclude);
routes.put('/users/update', Users.update);
routes.put('/users/uploadImage', Users.uploadImage);
routes.get('/users/retrieveProfilePic', Users.retrieveProfilePic);
routes.get('/users/retrieveProfilePics', Users.retrieveProfilePics);

module.exports = routes;
