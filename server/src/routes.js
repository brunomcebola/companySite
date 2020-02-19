const express = require('express');
const routes = express.Router();

/* controladores dos pedidos */
const AccessRequest = require('./controllers/AccessRequestController')
const Users = require('./controllers/UsersController')
const Inventory = require('./controllers/InventoryController')

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

routes.post('/inventory/create', Inventory.create)
routes.post('/inventory/updateTableName', Inventory.updateTableName)
routes.get('/inventory/paginate', Inventory.paginate)
routes.delete('/inventory/delete', Inventory.delete)
routes.get('/inventory/listing', Inventory.listing)
routes.post('/inventory/add', Inventory.add);
routes.put('/inventory/uploadImage', Inventory.uploadImage);
routes.get('/inventory/getTableName', Inventory.getTableName);
routes.post('/inventory/updateItem', Inventory.updateItem);
routes.delete('/inventory/deleteItem', Inventory.deleteItem);
routes.get('/inventory/pdf', Inventory.pdf);

module.exports = routes;
